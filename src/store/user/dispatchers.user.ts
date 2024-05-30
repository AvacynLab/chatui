import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '..';
import { textResponse } from '../../types/responses';

export const generateTextContent = createAsyncThunk(
  'user/generateTextContent',
  async ({ prompt, images, audioBlob }: { prompt: string, images: string[], audioBlob?: Blob }, thunkApi) => {
    const currentState = thunkApi.getState() as RootState;
    const { API_KEY: apiKey, sessionid, proxy } = currentState.user;

    const convertImageToBase64 = async (image: string) => {
      const blob = await fetch(image).then((response) => response.blob());
      const mimeType = blob.type; // Obtenir le type MIME du blob
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
          data: `data:${mimeType};base64,${base64Audio.split(',')[1]}`, // extrait la chaîne de base64 en supprimant le préfixe
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
      ...(sessionid && { overrideConfig: { sessionId: sessionid } }) // Ajout conditionnel de overrideConfig
    };

    const response = await fetch(
      `${proxy ? proxy : 'https://corsproxy.io/?'}https://api.avacyn.fr/api/v1/prediction/0772f062-4dbb-492f-96be-2164362a59cc`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      }
    );

    const data: textResponse = await response.json();

    if (!sessionid) {
      const sessionId = data.sessionId || '';
      thunkApi.dispatch({ type: 'user/setSessionid', payload: { sessionid: sessionId } });
    }

    thunkApi.dispatch({ type: 'user/setImages', payload: { images } });

    const aiAnswerText = data.text;

    if (aiAnswerText === undefined) {
      throw Error("Problème de requête");
    }

    return aiAnswerText;
  }
);