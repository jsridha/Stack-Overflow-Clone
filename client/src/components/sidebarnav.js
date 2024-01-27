import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from './AuthContext';

export function SideBarNav({ onQuestionsLinkClick, onTagsLinkClick, onUserProfileLinkClick }) {
  const [activeButton, setActiveButton] = useState(null);
  const { isLoggedIn } = useAuth();

  const handleQuestionsLinkClick = () => {
    setActiveButton('questions');
    onQuestionsLinkClick('questions', '', 'newest');
  };

  const handleTagsLinkClick = () => {
    setActiveButton('tags');
    onTagsLinkClick('tags');
  };

  const handleUserProfileLinkClick = () => {
    setActiveButton('userProfile');
    onUserProfileLinkClick();
  }

  return (
    <div id="sideBarNav" className="menu">
      <div id="questionsLink">
        <button
          type="button"
          id="questionsButton"
          className={activeButton === 'questions' ? 'active' : ''}
          onClick={handleQuestionsLinkClick}>
          Questions
        </button>
      </div>
      <div id="tagsLink">
        <button
          type="button"
          id="tagsButton"
          className={activeButton === 'tags' ? 'active' : ''}
          onClick={handleTagsLinkClick}>
          Tags
        </button>
      </div>
      {isLoggedIn && (
        <div id="profileLink">
          <button
            type="button"
            id="userProfileButton"
            className={activeButton === 'userProfile' ? 'active' : ''}
            onClick={handleUserProfileLinkClick}>
            User Profile
          </button>
        </div>
      )}
      
    </div>
  );
}

SideBarNav.propTypes = {
  onQuestionsLinkClick: PropTypes.func.isRequired,
  onTagsLinkClick: PropTypes.func.isRequired,
  onUserProfileLinkClick: PropTypes.func.isRequired,
};

export default SideBarNav;
