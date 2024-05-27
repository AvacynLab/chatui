import { Icon } from '@iconify/react'
import { useSelector, useDispatch } from 'react-redux'
import './Header.scss'
import Logout from '../../../components/Logout/Logout'
import { RootState } from '../../../store/index'
import { clearChat } from '../../../store/user/userSlice'
import ThemeToggle from '../../../components/ThemeToggle'
import { useState } from 'react'
import Modal from 'react-modal'

Modal.setAppElement('#root'); // Cette ligne est nécessaire pour l'accessibilité

function Header() {
    const { name } = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch()
    const [modalIsOpen, setModalIsOpen] = useState(false)

    const openInfo = () => {
        setModalIsOpen(true)
    }

    const closeModal = () => {
        setModalIsOpen(false)
    }

    return (
        <div className='header'>
            <span>Bonjour, {name}</span>
            <span>Avacyn • v0.3.0</span>
            <div className='header-buttons'>
                <Icon className='clear-icon' icon='fluent:person-info-24-regular' height={28} onClick={openInfo} />
                <Icon className='clear-icon' icon='fluent:person-delete-24-regular' height={28} onClick={() => dispatch(clearChat())} />
                <ThemeToggle />
                <Logout />
                
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Information Video"
                className="modal"
                overlayClassName="modal-overlay"
            >
                <div className='video-container'>
                    <iframe
                        width="560"
                        height="315"
                        src="https://www.youtube.com/embed/nQJ5yTqysDc"
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </Modal>
        </div>
    )
}

export default Header
