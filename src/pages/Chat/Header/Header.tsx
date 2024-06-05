import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useSelector, useDispatch } from 'react-redux';
import './Header.scss';
import Logout from '../../../components/Logout/Logout';
import { RootState } from '../../../store/index';
import { clearChat } from '../../../store/user/userSlice';
import ThemeToggle from '../../../components/ThemeToggle';
import Modal from 'react-modal';
import Slider from '../../../components/Slider/Slider';
import Popup from '../../../components/Popup/Popup'; // Importation du composant Popup

Modal.setAppElement('#root'); // Cette ligne est nécessaire pour l'accessibilité

function Header() {
    const { name } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openInfo = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    return (
        <div className='header'>
            <span>Bonjour, {name}</span>

            <div className='header-buttons'>
                <Popup text="Tuto & informations">
                    <Icon className='clear-icon' icon='fluent:person-info-24-regular' height={28} onClick={openInfo} />
                </Popup>
                <Popup text="Supprimer le chat">
                    <Icon className='clear-icon' icon='fluent:person-delete-24-regular' height={28} onClick={() => dispatch(clearChat())} />
                </Popup>
                <Popup text="Changer le thème">
                    <ThemeToggle />
                </Popup>
                
                <Logout />
                
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Information Video"
                className="modal"
                overlayClassName="modal-overlay"
            >
                <div className='slider-container'>
                    <Slider />
                </div>
            </Modal>
        </div>
    );
}

export default Header;
