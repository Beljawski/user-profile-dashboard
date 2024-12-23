import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import s from './index.module.css';
import shared from '../../shared.module.css';
import ReactAvatarEditor from 'react-avatar-editor';
import Placeholder from '../../assets/images/avatar_placeholder.svg';
import { VscSaveAs } from 'react-icons/vsc';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { AiOutlinePlus } from 'react-icons/ai';

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
  address: {
    maxLength: { value: 200, message: 'Maximum 200 characters allowed' },
    pattern: {
      value: /^[A-Za-zА-Яа-яёЁ0-9\s\-\.\/]+$/,
      message: 'Only letters, numbers, spaces, and hyphens are allowed',
    },
  },
  pitch: {
    maxLength: { value: 200, message: 'Maximum 200 characters allowed' },
    pattern: {
      value: /^[A-Za-zА-Яа-яёЁ0-9\s\-]+$/,
      message: 'Only letters, numbers, spaces, and hyphens are allowed',
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

  // States for dynamic fields
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

  // Save avatar image as Base64
  const handleSaveAvatar = () => {
    if (editor) {
      const roundedAvatar = editor.getImageScaledToCanvas().toDataURL();
      setAvatarPreview(roundedAvatar);
      setAvatar(roundedAvatar);
    }
  };

  // Delete current avatar
  const handleDeleteAvatar = () => {
    setAvatar('');
    setAvatarPreview('');
  };

  // Submit the form with all collected data
  const onSubmit = (data) => {
    if (avatarError) return; // Prevent submission if avatar error exists
    onSave({ ...data, interests, potentialInterests, links, showProfile, avatar });
  };

  // Render field-specific errors
  const renderError = (fieldName) =>
    errors[fieldName] && <p className={s.error_content}>{errors[fieldName]?.message}</p>;

  // Add a new item to dynamic lists (e.g., interests, links)
  const handleAddItem = (setter, list) => {
    if (list.length >= 10) {
      alert('You can enter a maximum of 10 interests.');
      return;
    }
    setter([...list, '']); // Adds a blank entry
  };

  const handleUpdateItem = (setter, list, index, value) => {
    if (value.length > 30) {
      alert('Each interest must be 30 characters or less.');
      return;
    }
    const updatedList = [...list];
    updatedList[index] = value; // Updates the specific item
    setter(updatedList);
  };

  // Remove an item from a dynamic list
  const handleRemoveItem = (setter, list, index) => {
    const updatedList = list.filter((_, i) => i !== index); // Removes the item
    setter(updatedList);
  };

  // Render input fields for dynamic lists (tags or links)
  const renderTagInputs = (list, setter) => (
    <div className={shared.tag_container}>
      {list.map((item, index) => (
        <div key={index} className={shared.tag}>
          <input
            type="text"
            className={shared.interests_input}
            placeholder={`#${index + 1}`}
            value={item}
            onChange={(e) => handleUpdateItem(setter, list, index, e.target.value)}
          />
          <button
            type="button"
            onClick={() => handleRemoveItem(setter, list, index)}
            className={s.remove_button}>
            ✕
          </button>
        </div>
      ))}
    </div>
  );

  // Handle dynamic list updates for links (name and url)
  const handleAddLink = (setter, list, newItem = '') => {
    if (list.length >= 10) {
      alert('You can enter a maximum of 10 items.');
      return;
    }
    setter([...list, newItem]); // Adds a new entry
  };

  const handleUpdateLink = (index, field, value) => {
    const updatedLinks = [...links];
    updatedLinks[index][field] = value; // Updates the specific link field
    setLinks(updatedLinks);
  };

  return (
    <div className={shared.profile_container}>
      <form className={shared.content_container} onSubmit={handleSubmit(onSubmit)}>
        {/* Avatar Upload */}
        <div className={shared.avatar_container}>
          <div
            className={`${s.avatar_wrapper} ${avatar ? '' : s.selectable}`}
            onClick={!avatar ? () => document.getElementById('fileUpload').click() : null}>
            {avatarPreview ? (
              <img src={avatarPreview} alt="Rounded Avatar" className={s.avatarPreview} />
            ) : avatar ? (
              <ReactAvatarEditor
                ref={(ref) => setEditor(ref)}
                image={avatar}
                width={120}
                height={120}
                borderRadius={60}
                scale={1.2}
                style={{ border: '1px solid #ccc' }}
              />
            ) : (
              <img src={Placeholder} alt="Avatar placeholder" className={s.img_placeholder} />
            )}
          </div>

          <input
            id="fileUpload"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className={s.hiddenFileInput}
          />
        </div>
        <div className={s.icons_container}>
          {avatar && !avatarPreview && (
            <VscSaveAs onClick={handleSaveAvatar} className={s.saveButton} />
          )}
          {avatar && <RiDeleteBin5Line onClick={handleDeleteAvatar} className={s.deleteButton} />}
        </div>

        {/* Standard input fields */}
        <div className={shared.input_container}>
          {['name', 'lastName', 'jobTitle', 'phone', 'email', 'address', 'pitch'].map((field) => (
            <div key={field}>
              <input
                type={field === 'email' ? 'email' : 'text'}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                className={shared.input}
                {...register(field, validationRules[field])}
              />
              {renderError(field)}
            </div>
          ))}
        </div>
        {/* Radio buttons for profile visibility */}
        <div className={s.radio_visibility_container}>
          <label className={shared.label}>Show your profile in Launchpad?</label>
          <div className={shared.radio_group}>
            {['private', 'public'].map((option) => (
              <label key={option} className={shared.radio_label}>
                <input
                  type="radio"
                  value={option}
                  checked={showProfile === option}
                  onChange={() => setShowProfile(option)}
                  className={shared.radio_input}
                />
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </label>
            ))}
          </div>
        </div>

        {/* Dynamic fields for interests, potential interests, and links */}
        <div className={shared.interests_container}>
          <label className={shared.label}>The scopes of your interest:</label>
          {renderTagInputs(interests, setInterests, 'Interest')}
          <AiOutlinePlus
            className={shared.add_button}
            onClick={() => handleAddItem(setInterests, interests)}
          />
        </div>

        <div className={shared.potential_interests_container}>
          <label className={shared.label}>Potential interests:</label>
          {renderTagInputs(potentialInterests, setPotentialInterests, 'Potential Interest')}
          <AiOutlinePlus
            className={shared.add_button}
            onClick={() => handleAddItem(setPotentialInterests, potentialInterests)}
          />
        </div>

        {/* Dynamic Links */}
        <div className={shared.links_container}>
          <label className={shared.label}>Your links:</label>
          {links.map((link, index) => (
            <div key={index} className={shared.link_item}>
              <input
                type="text"
                placeholder="Site Name"
                value={link.name}
                onChange={(e) => handleUpdateLink(index, 'name', e.target.value)}
                className={shared.link_input}
              />
              <input
                type="url"
                placeholder="URL"
                value={link.url}
                onChange={(e) => handleUpdateLink(index, 'url', e.target.value)}
                className={shared.link_input}
              />
              <RiDeleteBin5Line
                className={shared.remove_icon}
                onClick={() => handleRemoveItem(setLinks, links, index)}
              />
            </div>
          ))}
          <AiOutlinePlus
            className={shared.add_button}
            onClick={() => handleAddLink(setLinks, links, { name: '', url: '' })}
          />
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
