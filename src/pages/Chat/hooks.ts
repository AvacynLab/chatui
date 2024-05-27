import { AppDispatch, RootState } from '../../store/index';
import { generateTextContent } from "../../store/user/dispatchers.user";
import { useState, ChangeEvent, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

export const usePromptGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const dispatch: AppDispatch = useDispatch();
  const { data, loading, error, apiKey, proxy } = useSelector((state: RootState) => ({
    ...state.user.conversation,
    apiKey: state.user.API_KEY,
    sessionid: state.user.sessionid,
    proxy: state.user.proxy,
  }) || { data: [] });

  const handlePromptChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleSendPrompt = () => {
    if (prompt) {
      dispatch(generateTextContent({ prompt }));
      setPrompt('');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return; // No file selected, do nothing
    }

    // Validate file type
    const allowedFileTypes = ['text/plain', 'application/csv', 'application/pdf']; // Add more as needed
    if (!allowedFileTypes.includes(file.type)) {
      console.error('Invalid file type. Please select a text, CSV, PDF, or similar file.');
      return;
    }

    // Read file content as base64
    const readFileAsBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
      });
    };

    try {
      const fileContent = await readFileAsBase64(file);
      const base64Content = fileContent.split(',')[1]; // Extract base64 part

      const body = JSON.stringify({
        filename: file.name,
        content: base64Content,
        type: file.type
      });

      // Make API call to Flowise using Fetch
      const response = await fetch(
        `${proxy ? proxy : 'https://corsproxy.io/?'}https://api.avacyn.fr/api/v1/vector/upsert/0772f062-4dbb-492f-96be-2164362a59cc`, // Replace with your actual Flowise API endpoint
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: body,
        }
      );

      const result = await response.json();

      if (response.status === 200) {
        console.log('File uploaded and upserted to Flowise successfully:', result);
        // Handle successful upload (e.g., update state, display success message)
      } else {
        console.error('Error upserting document to Flowise:', result);
        // Handle upload error (e.g., display error message)
      }
    } catch (error) {
      console.error('Error making Flowise API request:', error);
      // Handle API request error (e.g., display error message)
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendPrompt();
    }
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function textAreaAdjust(element: HTMLTextAreaElement | null) {
    if (element) {
      element.style.height = '1px';
      element.style.height = (25 + element.scrollHeight) + 'px';
    }
  }

  useEffect(() => {
    if (textareaRef.current) {
      textAreaAdjust(textareaRef.current);
    }
  }, [prompt]);

  return { handlePromptChange, handleSendPrompt, handleKeyDown, handleFileUpload, data, prompt, textareaRef, loading, error };
};
