// burger.tsx
import './Burger.scss';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { clearUser } from '../../store/user/userSlice';
import ButtonLogOut from '../ButtonLogOut/ButtonLogOut';
import History from '../History/History';
import { NavLink } from 'react-router-dom';

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
                <NavLink to="/dashboard" className="navlink-disabled">
                <li className="avacyn">
                    <Icon icon="bxs:dashboard" height={20} className="home-icon" />
                </li>
                </NavLink>
                <NavLink to="/chat" className="navlink-disabled">
                <li className="menu-item-container">
                    <Icon icon="line-md:chat" height={20} />
                    <span className="menu-item-text">Chat</span>
                </li>
                </NavLink>
                <NavLink to="/search" className="navlink-disabled">
                <li className="menu-item-container">
                    <Icon icon="mingcute:search-3-line" height={20} />
                    <span className="menu-item-text">DeepSearch</span>
                </li>
                </NavLink>
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
