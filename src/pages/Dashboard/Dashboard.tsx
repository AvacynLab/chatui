import Burger from '../../components/Burger';
import './Dashboard.scss';
import { useState } from 'react';

function Dashboard() {
    const [isBurgerOpen, setIsBurgerOpen] = useState(false);

    const toggleBurger = () => {
        setIsBurgerOpen(!isBurgerOpen);
    };

    return (
        <div className={`main-page-container ${isBurgerOpen ? 'burger-open' : ''}`}>
            <Burger isOpen={isBurgerOpen} toggleBurger={toggleBurger} />
            <div className="content">


            </div>
        </div>
    );
}

export default Dashboard;
