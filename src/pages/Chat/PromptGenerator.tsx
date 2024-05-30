import ReactMarkdown from 'react-markdown';
import { usePromptGenerator } from './hooks';
import { useRef, useEffect } from 'react';
import LoadingLine from '../../components/LoadingLine';
import Button from '../../components/Button';
import { Icon } from '@iconify/react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Adjust this selector according to your app's root element

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
    handleMicrophoneAction, // Here is the handleMicrophoneAction
    isRecording, // To check recording state
    audioBlob  // Add audioBlob extraction here
  } = usePromptGenerator();

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [data]);

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
                {/* Afficher les images pour les messages sortants */}
                {message.type === 'outbound' && message.images && (
                  <div className="images-preview-container">
                    {message.images.map((image, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={image}
                        alt={`Pasted ${imgIndex}`}
                        className="pasted-image"
                        onClick={() => handleImageClick(image)}
                      />
                    ))}
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
        <div className="message-input-container">
          <textarea
            id="prompt"
            value={prompt}
            className="prompt-input"
            placeholder="Comment puis-je vous aider ?"
            onChange={handlePromptChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            ref={textareaRef}
          />
          {images.length > 0 && (
            <div className="images-preview-container">
              {images.map((image, index) => (
                <div key={index} className="image-wrapper">
                  <img
                    src={image}
                    alt={`Pasted ${index}`}
                    className="pasted-image"
                    onClick={() => handleImageClick(image)}
                  />
                  <button className="delete-button" onClick={() => handleImageDelete(index)}>✖</button>
                </div>
              ))}
            </div>
          )}
          <div className="icons-container">
            <div className="icon-wrapper">
              <Icon
                className='icon'
                icon='mdi:microphone'
                height={24}
                onClick={handleMicrophoneAction}
                style={{ cursor: 'pointer', color: isRecording ? '#DC4A41' : '#8952E0' }} // Change color if recording
              />
            </div>
            <div className="icon-wrapper">
              <Icon className='icon' icon='line-md:upload-loop' height={24} />
              <input type="file" id="fileInput" className="file-input" onChange={handleFileUpload} />
            </div>
          </div>
          <Button disabled={(!prompt && !audioBlob) || loading} onClick={handleSendPrompt} style={{ margin: '200' }}>
            Envoyer
          </Button>
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