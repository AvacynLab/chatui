import { AppDispatch, RootState } from '../../store/index'
import { generateTextContent } from "../../store/user/dispatchers.user"
import { useState, ChangeEvent, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"

export const usePromptGenerator = () => {
  const [prompt, setPrompt] = useState('')
  const dispatch: AppDispatch = useDispatch()
  const { data, loading, error } = useSelector((state: RootState) => state.user.conversation || { data: [] })

  const handlePromptChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value)
  }

  const handleSendPrompt = () => {
    if (prompt) {
      dispatch(generateTextContent({ prompt }))
      setPrompt('')
    }
  }

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
    // Create FormData object
    const formData = new FormData();
    formData.append('files', file);
  
    // Make API call to Flowise using Fetch
    try {
      const response = await fetch(
        'https://api.avacyn.fr/api/v1/vector/upsert/<chatlfowid>', // Replace with your actual Flowise API endpoint
        {
          method: 'POST',
          body: formData,
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
      e.preventDefault()
      handleSendPrompt()
    }
  }

  const textareaRef = useRef(null)

  function textAreaAdjust(element: HTMLTextAreaElement | null) {
    if (element) {
      element.style.height = '1px'
      element.style.height = (25 + element.scrollHeight) + 'px'
    }
  }

  useEffect(() => {
    if (textareaRef.current) {
      textAreaAdjust(textareaRef.current)
    }
  }, [prompt])

  return { handlePromptChange, handleSendPrompt, handleKeyDown, handleFileUpload, data, prompt, textareaRef, loading, error }
}
