import { createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '..'
import { textResponse } from '../../types/responses'

export const generateTextContent = createAsyncThunk(
  'user/generateTextContent',
  async ({ prompt, images }: { prompt: string, images: string[] }, thunkApi) => {
    const currentState = thunkApi.getState() as RootState
    const { API_KEY: apiKey, sessionid: sessionid, proxy } = currentState.user

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

    if (sessionid === '') {
      const response = await fetch(
        `${proxy ? proxy : 'https://corsproxy.io/?'}https://api.avacyn.fr/api/v1/prediction/0772f062-4dbb-492f-96be-2164362a59cc`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            question: prompt,
            uploads: await Promise.all(images.map(async (image) => {
              const { base64Image, mimeType } = await convertImageToBase64(image);
              return {
                data: `data:${mimeType};base64,${base64Image}`,
                type: 'file',
                name: 'image.png',
                mime: mimeType
              };
            }))
          }),
        }
      )

      const data: textResponse = await response.json()

      const sessionId = data.sessionId || '';

      thunkApi.dispatch({ type: 'user/setSessionid', payload: { sessionid: sessionId } })

      const aiAnswerText = data.text

      if (aiAnswerText === undefined) {
        throw Error("Problème de requête")
      }

      return aiAnswerText
    } else {
      const response = await fetch(
        `${proxy ? proxy : 'https://corsproxy.io/?'}https://api.avacyn.fr/api/v1/prediction/0772f062-4dbb-492f-96be-2164362a59cc`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            question: prompt,
            overrideConfig: {
              sessionId: sessionid
            },
            uploads: await Promise.all(images.map(async (image) => {
              const { base64Image, mimeType } = await convertImageToBase64(image);
              return {
                data: `data:${mimeType};base64,${base64Image}`,
                type: 'file',
                name: 'image.png',
                mime: mimeType
              };
            }))
          }),
        }
      )

      const data: textResponse = await response.json()

      const aiAnswerText = data.text

      if (aiAnswerText === undefined) {
        throw Error("Problème de requête")
      }

      return aiAnswerText
    }
  }
)
