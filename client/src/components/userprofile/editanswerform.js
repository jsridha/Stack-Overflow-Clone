import React, { useState } from 'react';
import PropTypes from 'prop-types';

function EditAnswerForm({ answer, submitAnswerEdit, deleteObject }) {
    const [newText, setNewText] = useState(answer.text);
    const [answerTextError, setAnswerTextError] = useState('');

    const handleAnswerSubmission = () => {
        setAnswerTextError('');

        let validInput = true;

        if (newText.trim() === '') {
        validInput = false;
        setAnswerTextError('Answer text cannot be empty.');
        }

        const linkRegex = /\[([^\]]*)\]\(([^)]*)\)/g;
        const hyperlinks = newText.match(linkRegex); // Define hyperlinks here

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

        if (validInput) {
            const formData = {
                newText: newText
            }
            submitAnswerEdit("answer", answer._id, formData);
        }
    };

    return (
        <div id="answerForm">
            <div>Answer Text:</div>
            <textarea
                id="answerTextInput"
                placeholder="Your answer..."
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
            />
            <div id="answerTextError" className="error">
                {answerTextError}
            </div>
            <button onClick={handleAnswerSubmission}>Update Answer</button>
            <button onClick={() => deleteObject('answer', answer._id)}>Delete Answer</button>
        </div>
    );
}

EditAnswerForm.propTypes = {
    answer: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        text: PropTypes.string,
    }).isRequired,
    submitAnswerEdit: PropTypes.func,
    deleteObject: PropTypes.func,
};

export default EditAnswerForm;
