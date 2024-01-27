import React, { useState } from 'react';
import PropTypes from 'prop-types';

function EditQuestionForm({ question, submitQuestionEdit, deleteObject }) {
    const [ title, setTitle ] = useState(question.title);
    const [ text, setText ] = useState(question.text);
    const [ tags, setTags ] = useState(question.tags.map(tag => tag.name).join(' '));
    const [titleError, setTitleError] = useState('');
    const [textError, setTextError] = useState('');
    const [tagError, setTagError] = useState('');

    const handleSubmission = () => {
        let validInput = true;
        setTitleError('');
        setTextError('');
        setTagError('');

        if (title.length === 0) {
        validInput = false;
            setTitleError('Title cannot be empty');
        } else if (title.length > 100) {
            validInput = false;
            setTitleError('Title cannot be more than 100 characters');
        }

        if (text === '') {
            validInput = false;
            setTextError('Question text cannot be empty');
        }

        const linkRegex = /\[([^\]]*)\]\(([^)]*)\)/g;
        const hyperlinks = text.match(linkRegex);

        if (hyperlinks) {
            for (const link of hyperlinks) {
                const match = link.match(/\[([^\]]*)\]\(([^)]*)\)/);
                if (!match || match.length < 3 || match[1].trim() === '' || match[2].trim() === '' || !match[2].startsWith('https://')) {
                    validInput = false;
                    setTextError('Invalid hyperlink');
                    break;
                }
            }
        }

        const tagArray = tags.split(' ');

        if (tagArray.length > 5) {
            validInput = false;
            setTagError('Cannot have more than 5 tags');
        } else if (tagArray.some(tag => tag.length > 20)) {
            validInput = false;
            setTagError('New tag length cannot be more than 20 characters');
        }

        if (validInput) {
            const formData = {
                newTitle: title,
                newText: text,
                newTags: tagArray
            }
        submitQuestionEdit("question", question._id, formData);
        }
    };

    return (
        <div>
            <div id="editQuestionForm">
            <div>Question Title:</div>
            <input
                type="text"
                placeholder="Enter a title (max 100 characters)"
                value={title}
                onChange={(e) => setTitle( e.target.value )}
                id="formTitleInput"
            />
            {titleError && <div className="error">{titleError}</div>}

            <div>Question Text:</div>
            <textarea
                placeholder="Enter your question"
                value={text}
                onChange={(e) => setText(e.target.value)}
                id="formTextInput"
            />
            {textError && <div className="error">{textError}</div>}

            <div>Tags (up to 5, separated by spaces):</div>
            <input
                type="text"
                placeholder="e.g., react javascript"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                id="formTagInput"
            />
            {tagError && <div className="error">{tagError}</div>}

            <button onClick={handleSubmission}>Update Question</button>
            <button onClick={() => deleteObject('question', question._id)}>Delete Question</button>
            </div>
        </div>
    );
}

EditQuestionForm.propTypes = {
    question: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        tags: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string.isRequired,
            })
        ).isRequired,
    }).isRequired,
    submitQuestionEdit: PropTypes.func,
    deleteObject: PropTypes.func,
};

export default EditQuestionForm;
