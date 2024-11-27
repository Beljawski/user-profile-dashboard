import React, { useEffect, useState } from 'react';
import ProfileEdit from '../../components/ProfileEdit';
import { getFromLocalStorage, saveToLocalStorage } from '../../localStorage';
import ProfileView from '../../components/ProfileView';
import s from './index.module.css';

function ProfilePage() {
    const [profileData, setProfileData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
  
    useEffect(() => {
      const storedData = getFromLocalStorage('profileData');
      if (storedData) {
        setProfileData(storedData); // Daten aus localStorage setzen
      } else {
        setProfileData({ name: '', lastName: '', jobTitle: '', email: '', address: '', pitch: '' }); // Standardwerte
      }
    }, []);
  
    // Funktion, um die eingegebenen Daten zu speichern
    const handleSaveData = (data) => {
      setProfileData(data);
      saveToLocalStorage('profileData', data); // Speichert die Daten im localStorage
      setIsEditing(false);
    };
  
  
    return (
      <div className={s.profile_page}>
        {profileData === null ? (
          <div>Loading...</div>
        ) : isEditing ? (
          <ProfileEdit profileData={profileData} onSave={handleSaveData} />
        ) : (
          <ProfileView
            profileData={profileData}
            onEdit={() => setIsEditing(true)}
          />
        )}
      </div>
    );
  }
  

export default ProfilePage;
