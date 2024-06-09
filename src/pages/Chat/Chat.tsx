import Header from './Header';
import PromptGenerator from './PromptGenerator';
import Burger from './Burger';
import './Chat.scss';
import { useState } from 'react';

function Chat() {
    const [isBurgerOpen, setIsBurgerOpen] = useState(false);

    const toggleBurger = () => {
        setIsBurgerOpen(!isBurgerOpen);
    };

    return (
        <div className={`main-page-container ${isBurgerOpen ? 'burger-open' : ''}`}>
            <Burger isOpen={isBurgerOpen} toggleBurger={toggleBurger} />
            <div className="content">
                <Header toggleBurger={toggleBurger} />
                <PromptGenerator />
            </div>
        </div>
    );
}

export default Chat;
