import React, { useState } from 'react';
import PropTypes from 'prop-types';

function EditTagForm({ tag, submitTagEdit, deleteObject }) {
    const [newName, setNewName] = useState(tag.name);
    const [tagNameError, setTagNameError] = useState('');

    const handleTagSubmission = () => {
        setTagNameError('');

        let validInput = true;

        if (newName.trim() === '') {
            validInput = false;
            setTagNameError('Tag name cannot be empty.');
        } else if (newName.length > 20) {
            validInput = false;
            setTagNameError('New tag length cannot be more than 20 characters');
        }

        if (validInput) {
            const formData = {
                newName: newName
            }
            submitTagEdit('tag', tag._id, formData);
        }
    };

    return (
        <div id="tagForm">
            <div>Tag Name:</div>
            <textarea
                id="tagNameInput"
                placeholder="Your answer..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
            />
            <div id="tagNameError" className="error">
                {tagNameError}
            </div>
            <button onClick={handleTagSubmission}>Update Tag</button>
            <button onClick={() => deleteObject('tag', tag._id)}>Delete Tag</button>
        </div>
    );
}

EditTagForm.propTypes = {
    tag: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string,
    }).isRequired,
    submitTagEdit: PropTypes.func,
    deleteObject: PropTypes.func,
};

export default EditTagForm;
