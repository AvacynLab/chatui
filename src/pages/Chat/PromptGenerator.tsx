import ReactMarkdown from 'react-markdown'
import { usePromptGenerator } from './hooks'
import { useRef, useEffect } from 'react'
import LoadingLine from '../../components/LoadingLine'
import Button from '../../components/Button'
import { Upload, Mic } from 'react-feather'

function PromptGenerator() {
  const {
    handlePromptChange,
    handleSendPrompt,
    handleKeyDown,
    handleFileUpload,
    data,
    prompt,
    textareaRef,
    loading,
    error,
  } = usePromptGenerator()

  const messagesContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [data])

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
                <strong style={{ color: '#8952E0' }}>
                  {message.type === 'inbound' ? 'Avacyn' : 'Vous'}
                </strong>
                {message.type === 'inbound' ? (
                  <ReactMarkdown className="markdown-render">{message.message}</ReactMarkdown>
                ) : (
                  <p>{message.message}</p>
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
            ref={textareaRef}
          />
          <div className="file-input-container">
            <Mic size={16} color="#ffffff" /> {/* Use Feather icon */}
            <input type="file" id="fileInput" className="mic-input" />
            
          </div>
          <div className="file-input-container">
            <Upload size={16} color="#ffffff" /> {/* Use Feather icon */}
            <input type="file" id="fileInput" className="file-input" onChange={handleFileUpload} />

          </div>
          
          <Button  disabled={!prompt || loading} onClick={handleSendPrompt} style={{ margin: '200' }}>
            Envoyer
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PromptGenerator
