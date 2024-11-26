import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import s from './index.module.css';
import shared from '../../shared.module.css';
import ReactAvatarEditor from 'react-avatar-editor';
import Placeholder from '../../assets/images/avatar_placeholder.svg';
import { VscSaveAs } from 'react-icons/vsc';
import { RiDeleteBin5Line } from 'react-icons/ri';

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

  const handleSaveAvatar = () => {
    if (editor) {
      const roundedAvatar = editor.getImageScaledToCanvas().toDataURL();
      setAvatarPreview(roundedAvatar);
      setAvatar(roundedAvatar);
    }
  };  

  const handleDeleteAvatar = () => {
    setAvatar('');
    setAvatarPreview('');
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

  // Handle dynamic list updates for links (name and url)
  const handleUpdateLink = (index, field, value) => {
    const updatedLinks = [...links];
    updatedLinks[index][field] = value;
    setLinks(updatedLinks);
  };

    // Add placeholder fallback for older browsers
    // useEffect(() => {
    //   if (!('placeholder' in document.createElement('input'))) {
    //     const inputs = document.querySelectorAll(`.${s.input}`);
    //     inputs.forEach((input) => {
    //       const placeholderText = input.getAttribute('placeholder');
    //       if (placeholderText) {
    //         input.value = placeholderText;
    //         input.addEventListener('focus', function () {
    //           if (this.value === placeholderText) this.value = '';
    //         });
    //         input.addEventListener('blur', function () {
    //           if (this.value === '') this.value = placeholderText;
    //         });
    //       }
    //     });
    //   }
    // }, []);
  
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
        {['name', 'lastName', 'jobTitle', 'phone', 'email'].map((field) => (
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

        {/* Dynamic fields for interests, potential interests, and links */}
        <div>
          <label className={shared.label}>The scopes of your interest:</label>
          <button type="button" onClick={() => handleAddItem(setInterests, interests)}>
            +
          </button>
          {renderTagInputs(interests, setInterests, 'Interest')}
        </div>

        <div>
          <label className={shared.label}>Potential interests:</label>
          <button
            type="button"
            onClick={() => handleAddItem(setPotentialInterests, potentialInterests)}>
            +
          </button>
          {renderTagInputs(potentialInterests, setPotentialInterests, 'Potential Interest')}
        </div>

        {/* Dynamic Links */}
        <div className={s.links_container}>
          <label className={shared.label}>Your links:</label>
          {links.map((link, index) => (
            <div key={index} className={s.link_item}>
              <input
                type="text"
                placeholder="Site Name"
                value={link.name}
                onChange={(e) => handleUpdateLink(index, 'name', e.target.value)}
                className={s.input}
              />
              <input
                type="url"
                placeholder="URL"
                value={link.url}
                onChange={(e) => handleUpdateLink(index, 'url', e.target.value)}
                className={s.input}
              />
              <button
                type="button"
                onClick={() => handleRemoveItem(setLinks, links, index)}
                className={s.remove_button}>
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddItem(setLinks, links, { name: '', url: '' })}
            className={shared.button}>
            + Add Link
          </button>
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
