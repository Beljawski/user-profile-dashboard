import React, { useState } from 'react';
import s from './index.module.css';
import shared from '../../shared.module.css';
import Placeholder from '../../assets/images/avatar_placeholder.svg';

function AvatarUpload() {
  const [avatar, setAvatar] = useState(null); // Gespeichertes Avatar-Bild
  const [error, setError] = useState(null);  // Validierungsfehler

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
  const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/jpg'];

  // Avatar-Datei hochladen
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Validierung: Dateityp und -größe
    if (!SUPPORTED_FORMATS.includes(file.type)) {
      setError('Unsupported file format. Only .jpg, .jpeg, .png are allowed.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('File size exceeds the 5MB limit.');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result); // Bild in Base64 umwandeln
    };
    reader.readAsDataURL(file);
  };

  // Avatar entfernen
  const handleRemoveAvatar = () => {
    setAvatar(null);
    setError(null);
  };

  return (
    <div className={shared.avatar_container}>
      <div className={s.avatar_wrapper}>
        {/* Zeige Avatar oder Platzhalter */}
        {avatar ? (
          <img src={avatar} alt="Avatar" className={s.avatar} />
        ) : (
          <img src={Placeholder} alt="Placeholder" className={s.img_placeholder} />
        )}
      </div>

      <div className={s.button_group}>
        {/* Datei hochladen */}
        <label htmlFor="avatarUpload" className={shared.button}>
          {avatar ? 'Change Avatar' : 'Upload Avatar'}
        </label>
        <input
          id="avatarUpload"
          type="file"
          accept=".jpg, .jpeg, .png"
          onChange={handleFileChange}
          className={s.file_input}
        />

        {/* Avatar entfernen */}
        {avatar && (
          <button onClick={handleRemoveAvatar} type="button" className={`${shared.button} ${s.remove_button}`}>
            Remove Avatar
          </button>
        )}
      </div>

      {/* Fehler anzeigen */}
      {error && <p className={s.error_message}>{error}</p>}
    </div>
  );
}

export default AvatarUpload;
