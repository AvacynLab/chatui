import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useDispatch } from 'react-redux';
import './Header.scss';
import ButtonLogOut from '../../../components/ButtonLogOut/ButtonLogOut';

import { clearChat, clearUser } from '../../../store/user/userSlice';
import ThemeToggle from '../../../components/ThemeToggle';
import Modal from 'react-modal';
import Slider from '../../../components/Slider/Slider';
import Popup from '../../../components/Popup/Popup';

Modal.setAppElement('#root');

function Header() {
    const dispatch = useDispatch();
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openInfo = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleLogout = () => {
        dispatch(clearUser())
    }

    return (
        <div className='header'>
            <div className='header-box'>
                <Icon className='burger-icon' icon='solar:hamburger-menu-broken' height={24} />
            </div>
            <div className='separator'>
            </div>
            <div className='header-box' onClick={openInfo}>
                <Popup text="Tuto & informations">
                    <Icon className='clear-icon' icon='fluent:person-info-24-regular' height={24} />
                </Popup>
            </div>
            <div className='header-box' onClick={() => dispatch(clearChat())}>
                <Popup text="Supprimer le chat">
                    <Icon className='clear-icon' icon='fluent:person-delete-24-regular' height={24} />
                </Popup>
            </div>
            <div className='header-box'>
                <Popup text="Changer le thème">
                    <ThemeToggle />
                </Popup>
            </div>
            <ButtonLogOut onClick={handleLogout}>
                <Icon icon="line-md:log-out" width={24} />
            </ButtonLogOut>

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
