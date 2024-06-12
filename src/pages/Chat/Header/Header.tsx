// Header.tsx
import { useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useDispatch } from 'react-redux';
import './Header.scss';
import { autoSaveChat } from '../../../store/user/userSlice'; // Import autoSaveChat
import ThemeToggle from '../../../components/ThemeToggle';
import Modal from 'react-modal';
import Popup from '../../../components/Popup/Popup';

Modal.setAppElement('#root');

interface HeaderProps {
    toggleBurger: () => void;
}

function Header({ toggleBurger }: HeaderProps) {
    const dispatch = useDispatch();


    useEffect(() => {
        const interval = setInterval(() => {
            dispatch(autoSaveChat());
        }, 500); // Auto-save every 5 seconds

        return () => clearInterval(interval);
    }, [dispatch]);

    return (
        <div className='header'>
            <div className='header-box' onClick={toggleBurger}>
                <Icon className='burger-icon' icon='solar:hamburger-menu-broken' height={24} />
            </div>
            <div className='separator'></div>

            {/* <div className='header-box' onClick={handleDeleteChat}>
                <Popup text="Supprimer le chat">
                    <Icon className='clear-icon' icon='fluent:person-delete-24-regular' height={24} />
                </Popup>
            </div> */}
            <div className='header-box'>
                <Popup text="Changer le thème">
                    <ThemeToggle />
                </Popup>
            </div>
        </div>
    );
}

export default Header;
