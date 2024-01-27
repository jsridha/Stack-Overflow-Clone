import React, { useState } from 'react';

const EditTagDialog = ({ tag, handleEditTag }) => {
  const [newTagName, setNewTagName] = useState(tag.name);

  const handleInputChange = (e) => {
    setNewTagName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleEditTag(tag._id, newTagName);
    setNewTagName(''); // Resetting the state to an empty string after submission
    // Close the dialog or reset the state to hide the dialog
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={newTagName} onChange={handleInputChange} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default EditTagDialog;
