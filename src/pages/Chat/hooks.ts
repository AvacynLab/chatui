import { AppDispatch, RootState } from '../../store/index';
import { generateTextContent } from "../../store/user/dispatchers.user";
import { useState, ChangeEvent, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

export const usePromptGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audioBlob, setAudioBlob] = useState<Blob | undefined>(undefined);

  const dispatch: AppDispatch = useDispatch();
  const { data, loading, error, apiKey, proxy, } = useSelector((state: RootState) => ({
    ...state.user.conversation,
    apiKey: state.user.API_KEY,
    sessionid: state.user.sessionid,
    proxy: state.user.proxy,
  }) || { data: [] });

  const handlePromptChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleSendPrompt = () => {
    if (prompt || audioBlob) {
      dispatch(generateTextContent({ prompt, images, audioBlob }));
      setPrompt('');
      setImages([]);
      setAudioBlob(undefined);
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = event.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            const url = URL.createObjectURL(file);
            addImageToList(url);
          }
          event.preventDefault();
        } else if (items[i].type === 'text/plain') {
          items[i].getAsString((text) => {
            insertTextAtCursor(text);
          });
          event.preventDefault();
        }
      }
    }
  };

  // Gestion de l'audio
  useEffect(() => {
    if (audioChunks.length > 0) {
      const blob = new Blob(audioChunks, { type: 'audio/webm' });
      setAudioBlob(blob);
    }
  }, [audioChunks]);

  const handleMicrophoneAction = () => {
    if (!isRecording) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const recorder = new MediaRecorder(stream);
          recorder.ondataavailable = event => {
            setAudioChunks((prevChunks) => [...prevChunks, event.data]);
          };
          recorder.start();
          setMediaRecorder(recorder);
          setIsRecording(true);
        })
        .catch(error => {
          console.error('Error accessing microphone:', error);
        });
    } else {
      mediaRecorder?.stop();
      setIsRecording(false);
    }
  };

  // Autres méthodes existantes

  const addImageToList = (imageUrl: string) => {
    setImages((prevImages) => [...prevImages, imageUrl]);
  };

  const insertTextAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = prompt.slice(0, start) + text + prompt.slice(end);

    setPrompt(newText);

    textarea.selectionStart = textarea.selectionEnd = start + text.length;
    textarea.focus();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      addImageToList(url);
    } else {
      let formData = new FormData();
      formData.append("files", file);
      formData.append("pineconeNamespace", "Guillaume");

      const jsonBody = JSON.stringify({
        overrideConfig: {
          pineconeNamespace: "Guillaume"
        }
      });

      async function query(formData: FormData) {
        const response = await fetch(
          `${proxy ? proxy : ''}https://api.avacyn.fr/api/v1/vector/upsert/56a6e07c-c83d-4b83-bbbd-73e8b2c7bd28`,
          {
            method: "POST",
            body: formData,
            headers: {
              'Authorization': `Bearer ${apiKey}`,
            }
          }
        );
        const result = await response.json();
        return result;
      }

      formData.append("jsonBody", new Blob([jsonBody], { type: "application/json" }));

      query(formData).then((response) => {
        console.log(response);
      }).catch((error) => {
        console.error('Erreur lors de la requête API Flowise:', error);
      });
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

  const handleImageClick = (image: string) => {
    console.log(`Image clicked: ${image}`); // Debug logging
    setSelectedImage(image);
    setModalIsOpen(true);
  };

  const handleImageDelete = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedImage(undefined);
  };

  return {
    handlePromptChange,
    handleSendPrompt,
    handleKeyDown,
    handlePaste,
    handleFileUpload,
    handleImageClick,
    handleImageDelete,
    handleMicrophoneAction, // add handleMicrophoneAction here
    closeModal,
    data,
    prompt,
    textareaRef,
    loading,
    error,
    images,
    modalIsOpen,
    selectedImage,
    isRecording,
    audioBlob
  };
};