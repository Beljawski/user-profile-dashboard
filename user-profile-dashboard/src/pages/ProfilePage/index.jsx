import React, { useEffect, useState } from 'react';
import ProfileEdit from '../../components/ProfileEdit';
import { getFromLocalStorage, saveToLocalStorage } from '../../localStorage';
import ProfileView from '../../components/ProfileView';
import s from './index.module.css';

function ProfilePage() {
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(true); // State to toggle between view and edit mode

  useEffect(() => {
    // Fetch data from localStorage on component mount
    const storedData = getFromLocalStorage('profileData');
    if (storedData) {
      setProfileData(storedData); 
    } else {
      setProfileData({ name: '', lastName: '', jobTitle: '', email: '', address: '', pitch: '' }); 
    }
  }, []);

  // Function to handle saving profile data
  const handleSaveData = (data) => {
    setProfileData(data);
    saveToLocalStorage('profileData', data);
    setIsEditing(false);
  };
console.log(profileData);

  return (
    <div className={s.profile_page}>
      {profileData === null ? (
        <div>Loading...</div>
      ) : isEditing ? (
        <ProfileEdit profileData={profileData} onSave={handleSaveData} />
      ) : (
        <ProfileView profileData={profileData} onEdit={() => setIsEditing(true)} />
      )}
    </div>
  );
}

export default ProfilePage;
