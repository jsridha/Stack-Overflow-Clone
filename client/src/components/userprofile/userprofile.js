import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useAuth } from '../AuthContext';
import EditQuestionForm from './editquestionform.js';
import EditAnswerForm from './editanswerform.js';
import EditTagForm from './edittagform.js';

function UserProfile ({ setErrorMessage }) {
  const { userID } = useAuth();
  const [user, setUser] = useState('');
  const [objectList, setObjectList] = useState('');
  const [questions, setUserQuestions] = useState([]);
  const [answers, setUserAnswers] = useState([]);
  const [tags, setUserTags] = useState([]);
  const [memberDays, setMemberDays] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const questionsPerPage = 5;
  const [selectedObject, setSelectedObject] = useState(null);
  const [displayComponent, setDisplayComponent] = useState(null);

  const fetchUserData = async () => {
      try {
        const url = `http://localhost:8000/users/${userID}`;
        const response = await axios.get(url);
        setUser(response.data.user);
        setUserQuestions(response.data.user.questions);
        setUserAnswers(response.data.user.answers);
        setUserTags(response.data.user.tags);

        const memberSince = new Date(response.data.user.created_at);
        const currentDate = new Date();
        const daysDifference = Math.floor((currentDate - memberSince) / (1000 * 60 * 60 * 24));
        setMemberDays(daysDifference);
      } catch (error) {
        setErrorMessage(`Error fetching user data: ${error.response.data.error}`);
      }
  };

  // Mock formData
  useEffect(() => {
    fetchUserData();
  }, [userID]);

  const handleBtnClick = (type) => {
    setObjectList(type);
  }
  
  const handleNext = () => {
    setStartIndex((prevIndex) =>
      prevIndex + questionsPerPage >= questions.length ? 0 : prevIndex + questionsPerPage
    );
  };

  const handlePrev = () => {
    setStartIndex((prevIndex) =>
      prevIndex - questionsPerPage < 0 ? 0 : prevIndex - questionsPerPage
    );
  };

  const answerLinkClick = (answer) => {
    setSelectedObject(answer);
    setDisplayComponent('editAnswer');
  }

  const questionLinkClick = (question) => {
    setSelectedObject(question);
    setDisplayComponent('editQuestion');
  }

  const tagLinkClick = (tag) => {
    setSelectedObject(tag);
    setDisplayComponent('editTag');
  }

  const currentQuestions = questions.slice(startIndex, startIndex + questionsPerPage);
  const isMultiplePages = questions.length > questionsPerPage;
  const isFirstPage = startIndex === 0;

  const renderPaginationButtons = () => {
    return (
      isMultiplePages && (
        <div className="paginationButtons">
          <button onClick={handlePrev} disabled={isFirstPage}>
            Prev
          </button>
          <button
            onClick={handleNext}
            disabled={startIndex + questionsPerPage >= questions.length}
          >
            Next
          </button>
        </div>
      )
    );
  };

  const renderQuestionList = currentQuestions.map((question) => (
    <div key={question._id}>
      <button 
        type="button"
        id="questionButton"
        onClick={() => questionLinkClick(question)}>
          {question.title}
      </button>
    </div>
  ));

  const deleteObject = async (objectType, objectID) => {
    await axios.post(`http://localhost:8000/delete/${objectType}/${objectID}`)
    .then(() => {
      fetchUserData();
      setDisplayComponent('profile');
    }).catch((error)=> {
      setErrorMessage(`Error deleting ${objectType}: ${error.response.data.error}`);
    });
  }

  const editObject = async (objectType, objectID, formData) => {
    await axios.post(`http://localhost:8000/edit/${objectType}/${objectID}`, formData)
    .then(() => {
      fetchUserData();
      setDisplayComponent('profile');
    }).catch((error)=> {
      setErrorMessage(`Error editing ${objectType}: ${error.response.data.error}`);
    });
  }

  const renderAnswerList = answers.map((answer) => (
    <div key={answer._id}>
      <button 
        type="button"
        id="answerButton"
        onClick={() => answerLinkClick(answer)}>
          {answer.text}
      </button>
    </div>
  ));

  const renderTagList = tags.map((tag) => (
    <div className="tagNode" key={tag._id}>
      <button onClick={() => tagLinkClick(tag)}>
          {tag.name}
      </button>
    </div>
  ))
  
  if (displayComponent === 'editQuestion') {
    return (
      <EditQuestionForm 
        question={selectedObject} 
        submitQuestionEdit= {editObject} 
        deleteObject={deleteObject}
      />
    )
  } else if (displayComponent === 'editAnswer') {
    return (
      <EditAnswerForm 
        answer={selectedObject} 
        submitAnswerEdit= {editObject} 
        deleteObject={deleteObject}
      />
    )
  } else if (displayComponent === 'editTag') {
    return (
      <EditTagForm 
        tag={selectedObject} 
        submitTagEdit= {editObject} 
        deleteObject={deleteObject}
      />
    )
  } else {
    return (
      <div>
        <div id='userProfileHeader'>

          <h1>{user.username + '\'s Profile'}</h1>

          <div id='userStats'>
              <p>Number of active days: {memberDays}</p>
              <p>Reputation: {user.reputation}</p>
          </div>
        </div>

        <div id='userProfileMenu'>
          <div className="button-container">
              <button onClick={() => handleBtnClick('questions')}>
                View My Questions
              </button>
          </div>
          <div className="button-container">
              <button onClick={() => handleBtnClick('answers')}>
                View My Answers
              </button>
          </div>
          <div className="button-container">
              <button onClick={() => handleBtnClick('tags')}>
                View My Tags
              </button>
          </div>
        </div>

        {objectList === 'questions' && (
          <div id='userProfileQstnList'>
            <h2>My Questions</h2>
            {renderQuestionList}
            {renderPaginationButtons()}
          </div>
        )}

        {objectList === 'answers' && (
          <div id='userProfileAnsList'>
            <h2>My Answers</h2>
            {renderAnswerList}
          </div>
        )}

        {objectList === 'tags' && (
          <div id='userProfileTagList'>
            <h2>My Tags</h2>
            {renderTagList}
          </div>
        )}
      </div>
    )
  }
}

UserProfile.propTypes = {
  setErrorMessage: PropTypes.func.isRequired
};

export default UserProfile;
