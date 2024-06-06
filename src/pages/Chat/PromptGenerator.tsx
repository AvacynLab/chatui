// promptgenerator.tsx
import ReactMarkdown from 'react-markdown';
import { usePromptGenerator } from './hooks';
import { useRef, useEffect } from 'react';
import LoadingLine from '../../components/LoadingLine';
import ButtonSend from '../../components/ButtonSend';
import { Icon } from '@iconify/react';
import Modal from 'react-modal';
import Popup from '../../components/Popup/Popup';
import SuggestionChat from '../../components/SuggestionChat';
import CustomAudioPlayer from '../../components/CustomAudioPlayer';

Modal.setAppElement('#root');

function PromptGenerator() {
  const {
    handlePromptChange,
    handleSendPrompt,
    handleKeyDown,
    handlePaste,
    handleFileUpload,
    handleImageClick,
    handleImageDelete,
    closeModal,
    data,
    prompt,
    textareaRef,
    loading,
    error,
    images,
    modalIsOpen,
    selectedImage,
    handleMicrophoneAction,
    isRecording,
    audioBlob,
    handleAudioDelete,
    handleAudioPlay,
    handleSuggestionClick
  } = usePromptGenerator();

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [data]);

  const suggestions = [
    "Recherche-moi l'actualité d'aujourd'hui.",
    "Peux-tu m'écrire un post LinkedIn pour...",
    "Donne-moi des conseils pour...",
    "Rédige moi une étude de marché sur..."
  ];

  return (
    <div className="chat-page-container">
      <div className="conversation-container">
        <div className="messages-container" ref={messagesContainerRef}>
          {data &&
            data.map((message, index) => (
              <div
                className={`message ${message.type === 'inbound' ? 'inbound' : 'outbound'}`}
                key={index}
              >
                {message.type === 'inbound' && (
                  <strong style={{ color: '#8952E0' }}>
                    Avacyn
                  </strong>
                )}
                {message.type === 'outbound' && (
                  <strong style={{ color: '#7D7F83' }}>
                    Vous
                  </strong>
                )}
                {message.type === 'inbound' ? (
                  <ReactMarkdown className="markdown-render">{message.message}</ReactMarkdown>
                ) : (
                  <p>{message.message}</p>
                )}
                {message.type === 'outbound' && message.images && (
                  <div className="images-preview-container">
                    {message.images.map((image, imgIndex) => (
                      <div
                        key={imgIndex}
                        className="image-wrapper"
                      >
                        <img
                          src={image}
                          alt={`Pasted ${imgIndex}`}
                          className="pasted-image"
                        />
                        <button className="magnify-button" onClick={(e) => { e.stopPropagation(); handleImageClick(image); }}>
                          <Icon icon="mdi:magnify" className="magnify-icon" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {message.audio && (
                  <div className="audio-container">
                    <CustomAudioPlayer audioBlob={message.audio} onDelete={handleAudioDelete} />
                  </div>
                )}
              </div>
            ))}
          {loading && <LoadingLine />}
          {error && (
            <div className="error">
              Une erreur est survenue. Envoi du message échoué. <br /> {error}
            </div>
          )}
        </div>
        <div className="interaction-container">
          <SuggestionChat 
            suggestions={suggestions} 
            onSuggestionClick={handleSuggestionClick} 
          />
          <div className="textarea-container">
            <textarea
              id="prompt"
              value={prompt}
              className="prompt-input"
              placeholder=""
              onChange={handlePromptChange}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              ref={textareaRef}
            />
            {audioBlob && (
              <div className="audio-preview-container">
                <CustomAudioPlayer audioBlob={audioBlob} onDelete={handleAudioDelete} />
              </div>
            )}
            {images.length > 0 && (
              <div className="images-preview-container">
                {images.map((image, index) => (
                  <div key={index} className="image-wrapper">
                    <img
                      src={image}
                      alt={`Pasted ${index}`}
                      className="pasted-image"
                    />
                    <div className="image-hover-overlay">
                      <Icon icon="mdi:delete" className="hover-icon delete-icon" onClick={(e) => { e.stopPropagation(); handleImageDelete(index); }} />
                    </div>
                    <button className="magnify-button" onClick={(e) => { e.stopPropagation(); handleImageClick(image); }}>
                      <Icon icon="mdi:magnify" className="magnify-icon" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="icons-and-button-container">
            <div className="icons-container">
              <Popup text="Utiliser le micro">
                <Icon
                  className='icon microphone-icon'
                  icon={isRecording ? 'line-md:loading-alt-loop' : 'fluent:slide-microphone-20-regular'}
                  height={24}
                  onClick={handleMicrophoneAction}
                  style={{ cursor: 'pointer', color: isRecording ? '#DC4A41' : '#8952E0' }}
                />
              </Popup>
              <Popup text="Téléverser un fichier">
                <Icon className='icon' icon='line-md:upload-outline-loop' height={24} />
                <input type="file" id="fileInput" className="file-input" onChange={handleFileUpload} />
              </Popup>
            </div>
            <ButtonSend disabled={(!prompt && !audioBlob) || loading} onClick={handleSendPrompt} style={{ margin: '200' }}>
              <Icon icon="mdi:send" width={24} />
            </ButtonSend>
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Image Modal"
        className="image-modal"
        overlayClassName="image-modal-overlay"
      >
        {selectedImage && <img src={selectedImage} alt="Modal content" className="modal-image" />}
        <button onClick={closeModal} className="close-modal-button">✖</button>
      </Modal>
    </div>
  );
}

export default PromptGenerator;
