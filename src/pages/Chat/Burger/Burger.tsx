// burger.tsx
import './Burger.scss';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { clearUser } from '../../../store/user/userSlice';
import ButtonLogOut from '../../../components/ButtonLogOut/ButtonLogOut';
import History from '../../../components/History';
import { clearChat } from '../../../store/user/userSlice';

interface BurgerProps {
    isOpen: boolean;
    toggleBurger: () => void;
}

function Burger({ isOpen }: BurgerProps) {
    const [isCollapsed] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(clearUser());
    };

    const handleNewChat = () => {
        dispatch(clearChat());
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <div 
            className={`burger-menu ${isOpen || isHovered ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <ul>
                <li className="avacyn" onClick={handleNewChat}>
                    <Icon icon="lucide:square-plus" height={20} className="home-icon" />
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
            
            <History />

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
