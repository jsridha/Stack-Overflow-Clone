import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from './AuthContext';

function QuestionForm({ formData, setFormData, onQuestionSubmit }) {
    const { title, text, tags } = formData;
    const { isLoggedIn, userID } = useAuth();
    const [setFormUserID] = useState(null);
    const [errorText, setErrorText] = useState('');

    useEffect(() => {
      if (isLoggedIn === 'true') {
        setFormUserID(userID);
      }
    }, [isLoggedIn, userID]);

    const handleSubmission = () => {
      let validInput = true;
      let errorMessage = '';

      if (title.trim().length === 0 || title.length > 100) {
        validInput = false;
        errorMessage += 'Title must not be empty and should be within 100 characters.\n';
      }

      if (text.trim().length === 0) {
        validInput = false;
        errorMessage += 'Question text must not be empty.\n';
      }

      const linkRegex = /\[([^\]]*)\]\(([^)]*)\)/g;
      const hyperlinks = text.match(linkRegex);

      if (hyperlinks) {
        for (const link of hyperlinks) {
          const match = link.match(/\[([^\]]*)\]\(([^)]*)\)/);
          if (!match || match.length < 3 || match[1].trim() === '' || match[2].trim() === '' || !match[2].startsWith('https://')) {
            validInput = false;
            errorMessage += 'Invalid hyperlink format. Hyperlinks must be in the format [text](URL) and start with "https://".\n';
            break;
          }
        }
      }

      const tagArray = tags.split(' ');

      if (tagArray.length > 5 || tagArray.some(tag => tag.length > 20)) {
        validInput = false;
        errorMessage += 'Tags should be up to 5, separated by spaces, and each tag should be within 20 characters.\n';
      }

      if (validInput) {
        onQuestionSubmit();
      } else {
        setErrorText(errorMessage); // Set the error message
      }
    };

  return (
    <div>
      {isLoggedIn ? (
        <div id="askQuestionForm">
          <div>Question Title:</div>
          <input
            type="text"
            placeholder="Enter a title (max 100 characters)"
            value={title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            id="formTitleInput"
          />

          <div>Question Text:</div>
          <textarea
            placeholder="Enter your question"
            value={text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            id="formTextInput"
          />

          <div>Tags (up to 5, separated by spaces):</div>
          <input
            type="text"
            placeholder="e.g., react javascript"
            value={tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            id="formTagInput"
          />
          <button onClick={handleSubmission}>Post Question</button>
          {/* Display error text */}
          {errorText && <p style={{ color: 'red' }}>{errorText}</p>}
        </div>
      ) : (
        window.location.href = 'http://localhost:3000/login'
      )}
    </div>
  );
}

QuestionForm.propTypes = {
  formData: PropTypes.shape({
    title: PropTypes.string,
    text: PropTypes.string,
    tags: PropTypes.string,
    username: PropTypes.string,
  }),
  setFormData: PropTypes.func,
  onQuestionSubmit: PropTypes.func,
};

export default QuestionForm;
