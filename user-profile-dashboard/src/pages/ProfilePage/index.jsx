import React, { useEffect, useState } from 'react';
import ProfileEdit from '../../components/ProfileEdit';
import { getFromLocalStorage, saveToLocalStorage } from '../../localStorage';
import ProfileView from '../../components/ProfileView';
import s from './index.module.css';

function ProfilePage() {
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(true);

  useEffect(() => {
    const storedData = getFromLocalStorage('profileData');
    if (storedData) {
      setProfileData(storedData); // Daten aus localStorage setzen
    } else {
      setProfileData({ name: '', lastName: '', jobTitle: '', email: '' }); // Standardwerte, wenn keine Daten da sind
    }
  }, []);

  // Funktion, um die eingegebenen Daten zu speichern und zurück zum View-Modus zu wechseln
  const handleSaveData = (data) => {
    setProfileData(data);
    saveToLocalStorage('profileData', data); // Speichert die Daten im localStorage
    setIsEditing(false); // Wechseln in den View-Modus
  };

  // Funktion, um in den Edit-Modus zurückzukehren
  const handleEdit = () => {
    setIsEditing(true); // Wechsel in den Edit-Modus
  };

  return (
    <div className={s.profile_page}>
      {profileData === null ? (
        <div>Loading...</div> // Ladeanzeige, wenn noch keine Daten geladen sind
      ) : isEditing ? (
        <ProfileEdit profileData={profileData} onSave={handleSaveData} />
      ) : (
        <ProfileView profileData={profileData} onEdit={handleEdit} />
      )}
    </div>
  );
}

export default ProfilePage;
