import React from 'react';
import UserProfile from '../components/UserProfile';
import '../styles/UserProfilePage.css';

const UserProfilePage: React.FC = () => {
    return (
        <div className="user-profile-page">
            <UserProfile />
        </div>
    );
};

export default UserProfilePage;
