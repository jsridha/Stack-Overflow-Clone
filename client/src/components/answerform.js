import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from './AuthContext';

function AnswerForm({ formData, setFormData, onAnswerSubmit }) {
  const { text } = formData;
  const { isLoggedIn, userID } = useAuth();
  const [answerTextError, setAnswerTextError] = useState('');

  useEffect(() => {
    if (isLoggedIn === 'true') {
      setFormData({ ...formData, userID: userID });
    }
  }, [setFormData, formData]);

  const handleAnswerSubmission = () => {
    setAnswerTextError('');

    let validInput = true;

    if (text.trim() === '') {
      validInput = false;
      setAnswerTextError('Answer text cannot be empty.');
    }

    const linkRegex = /\[([^\]]*)\]\(([^)]*)\)/g;
    const hyperlinks = text.match(linkRegex); // Define hyperlinks here

    if (hyperlinks) {
      for (const link of hyperlinks) {
        const match = link.match(/\[([^\]]*)\]\(([^)]*)\)/);
        if (!match || match.length < 3 || match[1].trim() === '' || match[2].trim() === '' || !match[2].startsWith('https://')) {
          validInput = false;
          setAnswerTextError('Invalid hyperlink');
          break;
        }
      }
    }

    if (!isLoggedIn) {
      validInput = false;
    }

    if (validInput) {
      onAnswerSubmit();
      setFormData({ text: '' });
    }
  };

  return (
    <div id="answerForm">
      {!isLoggedIn && (() => { window.location.href = 'http://localhost:3000/login'; return null; })()}
      {isLoggedIn && (
        <>
          <div>Answer Text:</div>
          <textarea
            id="answerTextInput"
            placeholder="Your answer..."
            value={text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
          />
          <div id="answerTextError" className="error">
            {answerTextError}
          </div>
          <button onClick={handleAnswerSubmission}>Post Answer</button>
        </>
      )}
    </div>
  );
}

AnswerForm.propTypes = {
  formData: PropTypes.shape({
    username: PropTypes.string,
    text: PropTypes.string,
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
  onAnswerSubmit: PropTypes.func.isRequired,
};

export default AnswerForm;
