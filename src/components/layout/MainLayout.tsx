import React, { ReactNode, useState } from 'react';
import TopNavbar from './TopNavbar';
import RightProfilePanel from './RightProfilePanel';
import BorrowCart from '../borrow/BorrowCart';
import './MainLayout.css';

interface MainLayoutProps {
    children?: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const [showCart, setShowCart] = useState<boolean>(false);
    const [showProfile, setShowProfile] = useState<boolean>(false);

    return (
        <div className="app-layout">
            <div className="main-wrapper">
                <TopNavbar
                    onToggleCart={() => setShowCart((v) => !v)}
                    onToggleProfile={() => setShowProfile((v) => !v)}
                />
                <div className="content-wrapper" onClick={() => showProfile && setShowProfile(false)}>
                    <main className="main-content">{children}</main>
                    <RightProfilePanel visible={showProfile} onClose={() => setShowProfile(false)} />
                </div>
            </div>
            <BorrowCart visible={showCart} onClose={() => setShowCart(false)} />
        </div>
    );
};

export default MainLayout;
