import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import s from './index.module.css';
import shared from '../../shared.module.css';

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

  // State hooks for managing dynamic fields
  const [interests, setInterests] = useState(profileData?.interests || []);
  const [potentialInterests, setPotentialInterests] = useState(
    profileData?.potentialInterests || [],
  );
  const [links, setLinks] = useState(profileData?.links || []);
  const [showProfile, setShowProfile] = useState(profileData?.showProfile || 'private');
  const [avatar, setAvatar] = useState(profileData?.avatar || '');
  const [avatarError, setAvatarError] = useState('');

  // Predefined fields for the form
  const fields = [
    { name: 'name', placeholder: 'Name' },
    { name: 'lastName', placeholder: 'Last Name' },
    { name: 'jobTitle', placeholder: 'Job Title' },
    { name: 'phone', placeholder: 'Phone', type: 'tel' },
    { name: 'email', placeholder: 'Email', type: 'email' },
  ];

  // Handle form submission
  const onSubmit = (data) => {
    if (avatarError) return; // Prevent submission if avatar error exists
    onSave({ ...data, interests, potentialInterests, links, showProfile, avatar });
  };

  // Handle avatar upload
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size (limit: 5 MB)
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('File size exceeds 5 MB');
      return;
    }

    setAvatarError(''); // Clear error if file size is valid

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result); // Base64 string of the image
    };
    reader.readAsDataURL(file);
  };

  // Render validation error messages
  const renderError = (fieldName) =>
    errors[fieldName] && <p className={s.error_content}>{errors[fieldName]?.message}</p>;

  // General function to add new items to dynamic lists
  const handleAddItem = (setter, list, newItem = '') => {
    if (list.length < 10) setter([...list, newItem]);
  };

  // General function to remove items from dynamic lists
  const handleRemoveItem = (setter, list, index) => {
    setter(list.filter((_, i) => i !== index));
  };

  // Update a specific item in a dynamic list
  const handleUpdateItem = (setter, list, index, value) => {
    const updatedList = [...list];
    updatedList[index] = value;
    setter(updatedList);
  };

  // Render input fields for dynamic lists (tags or links)
  const renderTagInputs = (list, setter, placeholder) => (
    <div className={s.tagContainer}>
      {list.map((item, index) => (
        <div key={index} className={s.tag}>
          <input
            type="text"
            className={s.input}
            placeholder={`${placeholder} #${index + 1}`}
            value={item}
            onChange={(e) => handleUpdateItem(setter, list, index, e.target.value)}
          />
          <button
            type="button"
            onClick={() => handleRemoveItem(setter, list, index)}
            className={s.removeButton}>
            ✕
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className={shared.profile_container}>
      <form className={shared.content_container} onSubmit={handleSubmit(onSubmit)}>
        {/* Avatar Upload */}
        <div className={s.avatar_container}>
          {avatar && <img src={avatar} alt="Avatar" className={s.avatar} />}
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
          {avatarError && <p className={s.error_content}>{avatarError}</p>}
        </div>

        {/* Render standard input fields with validation */}
        {fields.map(({ name, placeholder, type = 'text' }) => (
          <div key={name}>
            <input
              type={type}
              placeholder={placeholder}
              className={s.input}
              {...register(name, validationRules[name])}
            />
            {renderError(name)}
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
          {renderTagInputs(interests, setInterests, 'Interest')}
        </div>

        <div>
          <label>Potential interests:</label>
          <button
            type="button"
            onClick={() => handleAddItem(setPotentialInterests, potentialInterests)}>
            +
          </button>
          {renderTagInputs(potentialInterests, setPotentialInterests, 'Potential Interest')}
        </div>

        {/* Submit button to save the form */}
        <button type="submit" className={shared.button}>Save</button>
      </form>
    </div>
  );
}

export default ProfileEdit;
