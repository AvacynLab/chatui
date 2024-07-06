import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '..';
import { textResponse, Search } from '../../types/responses';
import { autoSaveChat } from './userSlice';
import { v4 as uuidv4 } from 'uuid';

export const generateTextContent = createAsyncThunk(
  'user/generateTextContent',
  async ({ prompt, images, audioBlob }: { prompt: string, images: string[], audioBlob?: Blob }, thunkApi) => {
    const currentState = thunkApi.getState() as RootState;
    const { API_KEY: apiKey, sessionid, proxy } = currentState.user;

    const convertImageToBase64 = async (image: string) => {
      const blob = await fetch(image).then((response) => response.blob());
      const mimeType = blob.type;
      const reader = new FileReader();
      return new Promise<{ base64Image: string; mimeType: string }>((resolve) => {
        reader.onload = () => {
          const base64Image = reader.result as string;
          resolve({ base64Image: base64Image.split(',')[1], mimeType });
        };
        reader.readAsDataURL(blob);
      });
    };

    const convertAudioToBase64 = async (audioBlob: Blob) => {
      const reader = new FileReader();
      return new Promise<{ base64Audio: string; mimeType: string }>((resolve) => {
        reader.onload = () => {
          resolve({ base64Audio: reader.result as string, mimeType: audioBlob.type });
        };
        reader.onerror = (error) => {
          console.error('Error converting audio blob to base64:', error);
          resolve({ base64Audio: '', mimeType: audioBlob.type });
        };
        reader.readAsDataURL(audioBlob);
      });
    };

    const prepareUploads = async () => {
      const uploads = await Promise.all(images.map(async (image) => {
        const { base64Image, mimeType } = await convertImageToBase64(image);
        return {
          data: `data:${mimeType};base64,${base64Image}`,
          type: 'file',
          name: 'image.png',
          mime: mimeType
        };
      }));

      if (audioBlob) {
        const { base64Audio, mimeType } = await convertAudioToBase64(audioBlob);
        uploads.push({
          data: `data:${mimeType};base64,${base64Audio.split(',')[1]}`,
          type: 'audio',
          name: 'audio.webm',
          mime: mimeType
        });
      }

      return uploads;
    };

    const requestBody = {
      question: prompt,
      uploads: await prepareUploads(),
      ...(sessionid && { overrideConfig: { sessionId: sessionid } })
    };

    console.log('Request Body:', requestBody); // Debug log

    const response = await fetch(
      `${proxy ? proxy : ''}https://api.avacyn.fr/api/v1/prediction/d08ce996-0743-4daa-b44c-e9240b68d5a2`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API response error:', errorText); // Debug log
      throw new Error('Error in API response: ' + response.statusText);
    }

    const data: textResponse = await response.json();

    console.log('API Response Data:', data); // Debug log

    if (!sessionid) {
      const sessionId = data.sessionId || '';
      thunkApi.dispatch({ type: 'user/setSessionid', payload: { sessionid: sessionId } });
    }

    thunkApi.dispatch({ type: 'user/setImages', payload: { images } });

    let aiAnswerText = data.text;

    if (aiAnswerText === undefined) {
      throw Error("Problème de requête");
    }

    // Extract search data
    const searchData = extractSearchData(aiAnswerText);
    
    if (searchData) {
      const search: Search = {
        id: uuidv4(),
        title: searchData.title,
        datablock: searchData.datablock,
        timestamp: new Date().toISOString(),
        sources: searchData.sources,
        questions: searchData.questions,
        from: sessionid,
      };

      thunkApi.dispatch({ type: 'user/addSearch', payload: search });

      // Add search to the returned payload
      thunkApi.dispatch(autoSaveChat());
      
      return { text: aiAnswerText.replace(/::::SEARCH::::[\s\S]*?::::SEARCH::::/, '').trim(), search };
    }

    thunkApi.dispatch(autoSaveChat());

    return { text: aiAnswerText };
  }
);

const extractSearchData = (text: string) => {
  const searchRegex = /::::SEARCH::::([\s\S]*?)::::SEARCH::::/;
  const match = text.match(searchRegex);

  if (!match) return null;

  const searchContent = match[1];

  const title = extractSection(searchContent, '::::title::::');
  const sources = extractList(searchContent, '::::sources::::');
  const questions = extractList(searchContent, '::::questions::::');
  const datablock = extractDataBlocks(searchContent);

  return { title, datablock, sources, questions };
};

const extractSection = (text: string, sectionName: string) => {
  const regex = new RegExp(`${sectionName}([\\s\\S]*?)::::`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : '';
};

const extractList = (text: string, sectionName: string) => {
  const content = extractSection(text, sectionName);
  return content.split('\n').map(item => item.trim()).filter(Boolean);
};

const extractDataBlocks = (text: string) => {
  const datablockContent = extractSection(text, '::::datablock::::');
  const blocks = datablockContent.split('::h1::').filter(Boolean);

  return blocks.map(block => {
    const [h1, ...rest] = block.split('::h2::');
    const h2s = rest.map(item => item.split('::p::')[0].trim());
    const ps = rest.flatMap(item => {
      const parts = item.split('::p::');
      return parts.slice(1).map(p => p.trim());
    });

    return {
      h1: h1.trim(),
      h2: h2s,
      p: ps
    };
  });
};
