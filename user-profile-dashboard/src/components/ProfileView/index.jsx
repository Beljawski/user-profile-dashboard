import React from 'react';
import shared from '../../shared.module.css';
import s from './index.module.css';
import Placeholder from '../../assets/images/avatar_placeholder.svg';
import { AiOutlinePlus } from 'react-icons/ai';
import { RiDeleteBin5Line } from 'react-icons/ri';

function ProfileView({ profileData, onEdit }) {
  const {
    name,
    lastName,
    jobTitle,
    phone,
    email,
    address,
    pitch,
    interests = [],
    potentialInterests = [],
    links = [],
    avatar,
    showProfile,
  } = profileData;

  return (
    <div className={shared.profile_container}>
      <div className={shared.content_container}>
        {/* Avatar Display */}
        <div className={shared.avatar_container}>
          <div className={s.avatar_wrapper}>
            {avatar ? (
              <img src={avatar} alt="Avatar" className={s.avatarPreview} />
            ) : (
              <img src={Placeholder} alt="Avatar placeholder" className={s.img_placeholder} />
            )}
          </div>
        </div>

        {/* Static fields with readOnly */}
        <div className={shared.input_container}>
          <input type="text" value={name} className={shared.input} readOnly />
          <input type="text" value={lastName} className={shared.input} readOnly />
          <input type="text" value={jobTitle || 'Job Title'} className={shared.input} readOnly />
          <input type="text" value={phone} className={shared.input} readOnly />
          <input type="email" value={email} className={shared.input} readOnly />
          <input type="text" value={address || 'Address'} className={shared.input} readOnly />
          <input type="text" value={pitch || 'Pitch'} className={shared.input} readOnly />
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
                  disabled // Hier wird das Input-Feld nicht bearbeitbar gemacht
                  className={shared.radio_input}
                />
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </label>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div className={shared.interests_container}>
          <label className={shared.label}>The scopes of your interest:</label>
          <div className={s.tag_container}>
            {interests.length > 0
              ? interests.map((interest, index) =>
                  interest.trim() ? (
                    <div className={s.tag}>
                      <span key={interest} className={s.interests_input}>
                        {interest}
                      </span>
                    </div>
                  ) : null,
                )
              : null}
            <AiOutlinePlus className={shared.add_button} />
          </div>
        </div>
        {/* Potential interests */}
        <div className={shared.potential_interests_container}>
          <label className={shared.label}>Potential interests:</label>
          <div className={s.tag_container}>
            {potentialInterests.length > 0
              ? potentialInterests.map((interest, index) =>
                  interest.trim() ? (
                    <div className={s.tag}>
                      <span key={index} className={s.interests_input}>
                        {interest}
                      </span>
                    </div>
                  ) : null,
                )
              : null}
            <AiOutlinePlus className={shared.add_button} />
          </div>
        </div>

        {/* Links */}
        <div className={shared.links_container}>
          <label className={shared.label}>Your links:</label>
          {links.length > 0
            ? links.map((link, index) =>
                link.name.trim() ? (
                  <div key={index} className={shared.link_item}>
                    <input type="text" value={link.name} className={shared.link_input} />
                    <input
                      type="url"
                      placeholder="URL"
                      value={link.url}
                      className={shared.link_input}
                    />
                    <RiDeleteBin5Line className={shared.remove_icon} />
                  </div>
                ) : null,
              )
            : null}
          <AiOutlinePlus className={shared.add_button} />
        </div>
        <button type="button" className={shared.button} onClick={onEdit}>
          Edit
        </button>
      </div>
    </div>
  );
}

export default ProfileView;
