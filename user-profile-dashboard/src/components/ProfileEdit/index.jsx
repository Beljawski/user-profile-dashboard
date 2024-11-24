import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import s from './index.module.css';
import shared from '../../shared.module.css';
import ReactAvatarEditor from 'react-avatar-editor';

// Validation rules for form fields
const validationRules = {
  name: {
    required: '*The field "Name" is required',
    minLength: { value: 2, message: 'At least 2 characters required' },
    maxLength: { value: 50, message: 'Maximum 50 characters allowed' },
    pattern: {
      value: /^[A-Za-zА-Яа-яёЁ\-\s]+$/,
      message: 'Only letters and spaces are allowed',
    },
  },
  lastName: {
    required: '*The field "Last Name" is required',
    pattern: {
      value: /^[A-Za-zА-Яа-яёЁ\-\s]+$/,
      message: 'Only letters and spaces are allowed',
    },
  },
  jobTitle: {
    maxLength: { value: 100, message: 'Maximum 100 characters allowed' },
    pattern: {
      value: /^[A-Za-zА-Яа-яёЁ0-9\s\-]+$/,
      message: 'Only letters, numbers, spaces, and hyphens are allowed',
    },
  },
  phone: {
    required: '*The field "Phone" is required',
    pattern: {
      value: /^\+\d{10,15}$/,
      message: 'Invalid phone number',
    },
  },
  email: {
    required: '*The field "Email" is required',
    pattern: {
      value: /^\S+@\S+\.\S+$/,
      message: 'You entered the wrong e-mail.',
    },
  },
};

function ProfileEdit({ profileData, onSave }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: profileData, // Use initial data as default form values
  });

  // State hooks for dynamic fields
  const [interests, setInterests] = useState(profileData?.interests || []);
  const [potentialInterests, setPotentialInterests] = useState(
    profileData?.potentialInterests || []
  );
  const [links, setLinks] = useState(profileData?.links || []);
  const [showProfile, setShowProfile] = useState(profileData?.showProfile || 'private');
  const [avatar, setAvatar] = useState(profileData?.avatar || '');
  const [avatarError, setAvatarError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const editorRef = useRef(null);

  // Handle avatar upload
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size (limit: 5 MB)
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('File size exceeds 5 MB');
      return;
    }

    setAvatarError('');
    setSelectedFile(file); // Set file for cropping
  };

  const handleSaveAvatar = () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas().toDataURL();
      setAvatar(canvas); // Update avatar state with cropped image
      setSelectedFile(null); // Close the cropping editor
    }
  };

  // Render validation error messages
  const renderError = (fieldName) =>
    errors[fieldName] && <p className={s.error_content}>{errors[fieldName]?.message}</p>;

  // Dynamic field handlers
  const handleAddItem = (setter, list, newItem = '') => {
    if (list.length < 10) setter([...list, newItem]);
  };

  const handleRemoveItem = (setter, list, index) => {
    setter(list.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (setter, list, index, value) => {
    const updatedList = [...list];
    updatedList[index] = value;
    setter(updatedList);
  };

  // Submit form
  const onSubmit = (data) => {
    if (avatarError) return; // Prevent submission if avatar error exists
    onSave({ ...data, interests, potentialInterests, links, showProfile, avatar });
  };

  return (
    <div className={shared.profile_container}>
      <form className={shared.content_container} onSubmit={handleSubmit(onSubmit)}>
        {/* Avatar Upload */}
        <div className={s.avatar_container}>
          {selectedFile ? (
            <>
              <ReactAvatarEditor
                ref={editorRef}
                image={selectedFile}
                width={120}
                height={120}
                border={50}
                borderRadius={60}
                scale={1.2}
              />
              <div className={s.avatar_buttons}>
                <button type="button" onClick={handleSaveAvatar}>
                  Save Cropped Image
                </button>
                <button type="button" onClick={() => setSelectedFile(null)}>
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              {avatar && <img src={avatar} alt="Avatar" className={s.avatar} />}
              <input type="file" accept="image/*" onChange={handleAvatarChange} />
            </>
          )}
          {avatarError && <p className={s.error_content}>{avatarError}</p>}
        </div>

        {/* Standard input fields */}
        {['name', 'lastName', 'jobTitle', 'phone', 'email'].map((field) => (
          <div key={field}>
            <input
              type={field === 'email' ? 'email' : 'text'}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className={s.input}
              {...register(field, validationRules[field])}
            />
            {renderError(field)}
          </div>
        ))}

        {/* Radio buttons for profile visibility */}
        <div>
          <label>Show your profile in Launchpad?</label>
          <div className={s.radioGroup}>
            {['private', 'public'].map((option) => (
              <label key={option}>
                <input
                  type="radio"
                  value={option}
                  checked={showProfile === option}
                  onChange={() => setShowProfile(option)}
                />
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </label>
            ))}
          </div>
        </div>

        {/* Dynamic fields for interests and links */}
        <div>
          <label>The scopes of your interest:</label>
          <button type="button" onClick={() => handleAddItem(setInterests, interests)}>
            +
          </button>
          <div className={s.tagContainer}>
            {interests.map((item, index) => (
              <div key={index} className={s.tag}>
                <input
                  type="text"
                  value={item}
                  onChange={(e) =>
                    handleUpdateItem(setInterests, interests, index, e.target.value)
                  }
                />
                <button onClick={() => handleRemoveItem(setInterests, interests, index)}>
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button type="submit" className={shared.button}>
          Save
        </button>
      </form>
    </div>
  );
}

export default ProfileEdit;
