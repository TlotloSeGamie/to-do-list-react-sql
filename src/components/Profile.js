import React from 'react';
import './Profile.css';

const Profile = ({ user }) => {
    return (
        <div className="profile-container">
            <img src={user.profilePicture} alt="Profile" className="profile-image" />
            <h2 className="profile-name">{user.name}</h2>
            <p className="profile-email">{user.email}</p>
            <div className="task-stats">
                <p>Tasks Completed: {user.tasksCompleted}</p>
            </div>
        </div>
    );
};

export default Profile;
