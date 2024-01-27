import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;
import { HeaderContent } from './headercontent.js';
import { SideBarNav } from './sidebarnav.js';
import MainContent from './maincontent.js';
import makeUrl from '../utils/makeurl.js';
//import { useAuth } from './AuthContext';

export default function FakeStackOverflow() {
  const [displayComponent, setDisplayComponent] = useState('questionList');
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState(null);
  const [tagList, setTagList] = useState([]);
  const [qFormData, setQuestionFormData] = useState({
    title: '',
    text: '',
    tags: '',
    userID: '',
  });
  const [aFormData, setAnswerFormData] = useState({
    text: ''
  });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/questions/newest')
      .then((res) => {
        setQuestions(res.data);
        setQCount(res.data.length);
        setErrorMessage('');
      })
      .catch((error) => {
        setErrorMessage(`Error fetching data: ${error.response.data.error}`);
      });
  }, []);

  const [qCount, setQCount] = useState(questions.length);

  function handleContent(page, id, order) {
    axios.get(makeUrl(page, id, order))
      .then((res) => {
        if (page === 'questions') {
          if (!id) {
            setQuestions(res.data);
            if (questions.length > qCount) {
              setQCount(questions.length);
            }
            setDisplayComponent('questionList');
          } else {
            setQuestion(res.data);
            setDisplayComponent('viewQuestion');
          }
        } else if (page === 'tags') {
          if (!id) {
            setTagList(res.data);
            setDisplayComponent('viewAllTags');
          } else {
            setQuestions(res.data);
            if (questions.length > qCount) {
              setQCount(questions.length);
            }
            setDisplayComponent('questionList');
          }
        }
        setErrorMessage('');
      })
      .catch((error) => {
        setErrorMessage(`Error fetching data: ${error.response.data.error}`);
      });
  }

  const updateErrorMessage = (message) => {
    setErrorMessage(message);
  }

  const handleAskQuestionClick = () => {
    setDisplayComponent('askQuestionForm');
  };

  const handleAnswerQuestionClick = () => {
    setDisplayComponent('answerQuestionForm');
  }

  const handleQuestionSubmit = async () => {
    await axios.post('http://localhost:8000/newQuestionForm', qFormData)
    .then(async () => {
      await axios.get('http://localhost:8000/questions/newest')
      .then((res)=>{
        setQuestions(res.data);
        setQCount(res.data.length);
        setDisplayComponent('questionList');
        setErrorMessage('');
      }).catch((error) => {
        setErrorMessage(`Error fetching questions: ${error.response.data.error}`);
      })
    }).catch((error) => {
      setErrorMessage(`Error submitting question: ${error.response.data.error}`);
    })
  };

  const handleAnswerSubmission = async () => {
    
    const url = `http://localhost:8000/questions/${question._id}/answerQuestionForm`
    await axios.post(url, aFormData);
    await axios.get(makeUrl('questions', question._id))
    .then((res) => {
      setQuestion(res.data);
      setDisplayComponent('viewQuestion');
      setErrorMessage('');
    }).catch((error) => {
      setErrorMessage(`Error submitting answer: ${error.response.data.error}`);
    })
  }

  const handleProfileRequest = () => {
    setDisplayComponent('userProfile');
    setErrorMessage('');
  }

  const handleSearchInputKeyDown = useCallback((event) => {
    if (event.key === 'Enter') {
      const searchInput = document.getElementById('searchBar');
      if (searchInput) {
        const searchString = searchInput.value;
        const url = `http://localhost:8000/search/${searchString}`
        axios.get(url)
          .then((res) => {
            setQuestions(res.data.searchResults);
            if (questions.length > qCount) {
              setQCount(questions.length);
            }
            setDisplayComponent('questionList');
            setErrorMessage('');
          })
          .catch((error) => {
            setErrorMessage(`Error fetching search results: ${error.response.data.error}`);
          });
      }
    }
  }, [qCount, questions.length]);

  useEffect(() => {
    const searchInput = document.getElementById('searchBar');
    searchInput.addEventListener('keydown', handleSearchInputKeyDown);

    return () => {
      searchInput.removeEventListener('keydown', handleSearchInputKeyDown);
    };
  }, [handleSearchInputKeyDown])

  async function handleVote(voteType, objectType, objectId) {
    const voteInfo = {
      voteType: voteType,
      objectType: objectType,
      objectID: objectId,
      qID: question._id
    }
    await axios.post('http://localhost:8000/vote', voteInfo)
      .then((res) => {
        setQuestion(res.data.question);
        setDisplayComponent('viewQuestion');
        setErrorMessage('');
      }).catch((error) => {
        setErrorMessage(`Error submitting vote: ${error.response.data.error}`);
      })
  }

  async function handleCommentSubmit(objectType, objectID, commentText) {
    const commentInfo = {
      objectType: objectType,
      objectID: objectID,
      commentText: commentText,
      qID: question._id
    }
    await axios.post('http://localhost:8000/commentSubmit', commentInfo)
      .then((res) => {
        setQuestion(res.data.question);
        setDisplayComponent('viewQuestion');
        setErrorMessage('');
      }).catch ((error) => {
        setErrorMessage(`Error submitting comment: ${error.response.data.error}`);
      })
  }

  const handleAcceptAnswer = async (answerId) => {
    await axios.post(`http://localhost:8000/questions/${question._id}/answers/${answerId}/accept`, {}, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    await axios.get(makeUrl('questions', question._id))
    .then((res) => {
      setQuestion(res.data.question);
      setDisplayComponent('viewQuestion');
      setErrorMessage('');
    }).catch((error) => {
      setErrorMessage(`Error submitting answer: ${error.response.data.error}`);
    })
  };

  return (
    <div>

      <header>
        <HeaderContent />
      </header>

      <main>
        <div id="main" className="main">
          <SideBarNav
            onQuestionsLinkClick={() => handleContent('questions', '', 'newest')}
            onTagsLinkClick={() => handleContent('tags')}
            onAskQuestionClick={handleAskQuestionClick}
            onUserProfileLinkClick={handleProfileRequest}
          />
        <div id="main-content">
          {errorMessage && <div className="error">{errorMessage}</div>}
          <MainContent
              displayComponent={displayComponent}
              questions={questions}
              qTotal={qCount}
              onSortButtonClick={handleContent}
              onAskQuestionClick={handleAskQuestionClick}
              onQuestionClick={handleContent}
              question={question}
              onAnsQuestionClick={handleAnswerQuestionClick}
              tags={tagList}
              onTagClick={handleContent}
              qFormData={qFormData}
              setQuestionFormData={setQuestionFormData}
              onQuestionSubmit={handleQuestionSubmit}
              aFormData={aFormData}
              setAnswerFormData={setAnswerFormData}
              handleAnswerSubmission={handleAnswerSubmission}
              handleVote={handleVote}
              handleCommentSubmit={handleCommentSubmit}
              setErrorMessage={updateErrorMessage}
              handleAcceptAnswer={handleAcceptAnswer}
          />
        </div>
        </div>
      </main>
    </div>
  );
}
