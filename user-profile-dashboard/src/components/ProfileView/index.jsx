import React from 'react';
import shared from '../../shared.module.css';
import s from './index.module.css';


function ProfileView({ profileData, onEdit }) {
  return (
    <div className={shared.profile_container}>
      <img src={profileData.avatar} alt="" />
      <form className={shared.content_container}>
        <div className={s.view_form}>
          {/* Read-Only Fields */}
          <div className={s.field_group}>
            <label>Name:</label>
            <span className={s.readonly_field}>{profileData.name}</span>
          </div>

          <div className={s.field_group}>
            <label>Last Name:</label>
            <span className={s.readonly_field}>{profileData.lastName}</span>
          </div>

          <div className={s.field_group}>
            <label>Job Title:</label>
            <span className={s.readonly_field}>{profileData.jobTitle}</span>
          </div>

          <div className={s.field_group}>
            <label>Email:</label>
            <span className={s.readonly_field}>{profileData.email}</span>
          </div>

          <div className={s.field_group}>
            <label>Phone:</label>
            <span className={s.readonly_field}>{profileData.phone}</span>
          </div>

          <div className={s.field_group}>
            <label>Profile Visibility:</label>
            <span className={s.readonly_field}>
              {profileData.showProfile === 'private' ? 'Private' : 'Public'}
            </span>
          </div>

          {/* Interests */}
          <div className={s.tags_container}>
            <label>Interests:</label>
            <div className={s.tags_list}>
              {profileData.interests?.map((item, index) => (
                <span key={index} className={s.tag_item}>
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className={s.links_container}>
            <label>Links:</label>
            <div className={s.links_list}>
              {profileData.links?.map((item, index) => (
                <span key={index} className={s.link_item}>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <button type="button" className={shared.button} onClick={onEdit}>
            Edit
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfileView;
