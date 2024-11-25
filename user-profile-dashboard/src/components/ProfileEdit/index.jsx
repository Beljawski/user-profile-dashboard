import React, { useState } from 'react';
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
    defaultValues: profileData,
  });

  const [interests, setInterests] = useState(profileData?.interests || []);
  const [potentialInterests, setPotentialInterests] = useState(
    profileData?.potentialInterests || [],
  );
  const [links, setLinks] = useState(profileData?.links || []);
  const [showProfile, setShowProfile] = useState(profileData?.showProfile || 'private');
  const [avatar, setAvatar] = useState(profileData?.avatar || '');
  const [avatarError, setAvatarError] = useState('');
  const [editor, setEditor] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('File size exceeds 5 MB');
      return;
    }

    setAvatarError('');
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAvatar = () => {
    if (editor) {
      const canvas = editor.getImageScaledToCanvas().toDataURL();
      setAvatarPreview(canvas);
      setAvatar(canvas);
    }
  };

  const onSubmit = (data) => {
    if (avatarError) return;
    onSave({ ...data, interests, potentialInterests, links, showProfile, avatar });
  };

  const renderError = (fieldName) =>
    errors[fieldName] && <p className={s.error_content}>{errors[fieldName]?.message}</p>;

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

  return (
    <div className={shared.profile_container}>
      <form className={shared.content_container} onSubmit={handleSubmit(onSubmit)}>
        {/* Avatar Upload */}
        <div className={s.avatar_container}>
          {avatar ? (
            <ReactAvatarEditor
              ref={(ref) => setEditor(ref)}
              image={avatar}
              width={120}
              height={120}
              borderRadius={60}
              scale={1.2}
            />
          ) : (
            <p>No image selected</p>
          )}

          <div className={s.fileUploadContainer}>
            <label htmlFor="fileUpload" className={s.customFileUpload}>
              Select Image
            </label>
            <input
              id="fileUpload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className={s.hiddenFileInput}
            />
          </div>

          {avatar && (
            <button type="button" onClick={handleSaveAvatar} className={s.saveButton}>
              Save Cropped Image
            </button>
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
                  onChange={(e) => handleUpdateItem(setInterests, interests, index, e.target.value)}
                />
                <button onClick={() => handleRemoveItem(setInterests, interests, index)}>✕</button>
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
