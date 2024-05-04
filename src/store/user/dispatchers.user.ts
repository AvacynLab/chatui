import { createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '..'
import { textResponse } from '../../types/responses'

export const generateTextContent = createAsyncThunk(
  'user/generateTextContent',
  async ({ prompt }: { prompt: string }, thunkApi) => {
    const currentState = thunkApi.getState() as RootState
    const { proxy } = currentState.user //API_KEY: apiKey,

      const response = await fetch(
        `${proxy ? proxy : 'https://corsproxy.io/?'}https://api.avacyn.fr/api/v1/prediction/2e521168-d647-426b-8ebe-3c3890a4c3fc`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ question: prompt }), // Updated body
        }
      )

      const data: textResponse = await response.json()

      const aiAnswerText = data.text

      if (aiAnswerText === undefined) {
        throw Error("Problème de requête")
      }

      return aiAnswerText
  }
)