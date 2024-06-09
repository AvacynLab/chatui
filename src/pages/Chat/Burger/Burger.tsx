// burger.tsx
import './Burger.scss';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { clearUser } from '../../../store/user/userSlice';
import ButtonLogOut from '../../../components/ButtonLogOut/ButtonLogOut';

interface BurgerProps {
    isOpen: boolean;
    toggleBurger: () => void;
    // Added prop for user name
}

function Burger({ isOpen }: BurgerProps) {
    const [isCollapsed] = useState(true);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(clearUser());
    };

    return (
        <div className={`burger-menu ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
            <ul>
                <li className="  avacyn">
                    <Icon icon="mdi:home" height={20} className="home-icon" />
                </li>
                <li className="menu-item-container">
                    <Icon icon="fluent:book-contacts-24-regular" height={20} />
                    <span className="menu-item-text">CRM</span>
                </li>
                <li className="menu-item-container">
                    <Icon icon="mdi:search" height={20} />
                    <span className="menu-item-text">RECHERCHES</span>
                </li>
                <li className="menu-item-container">
                    <Icon icon="fluent-mdl2:contact-list" height={20} />
                    <span className="menu-item-text">AGENTS</span>
                </li>
            </ul>
            <div className="history-container">
                <span className="history-text">Historique</span>
            </div>

            <div className="logout-container">
                <div className="user-container">
                    <Icon icon="mdi:settings" height={24} className="user-icon"/>
                    <ButtonLogOut onClick={handleLogout}>
                        <Icon icon="line-md:log-out" width={24} />
                        <span className="logout-text">Déconnexion</span>
                    </ButtonLogOut>
                </div>
            </div>
            <span className="footer-text">v0.6.0</span>
        </div>
    );
}

export default Burger;
