import React, { useState, useEffect }  from 'react';
import PropTypes from 'prop-types';
import HyperlinkRenderer from './hyperlinkrenderer.js';
import { formatDate } from '../utils/formatdate.js';
import axios from 'axios';
axios.defaults.withCredentials = true;
import CommentList from './commentlist.js'
import { useAuth } from './AuthContext';

function AnswerList({ question, onAskQuestionClick, onAnsQuestionClick, handleVote, handleCommentSubmit}) {
  const { isLoggedIn, userID } = useAuth();
  const [answers, setAnswers] = useState(question.answers);
  const isQuestionOwner = question.asked_by._id === userID;
  console.log('isQuestionOwner:', isQuestionOwner);
  const [startIndex, setStartIndex] = useState(0);
  const answersPerPage = 5;

  useEffect(() => {
    // Sort answers based on accepted status and newest order
    const sortedAnswers = [...question.answers].sort((a, b) => {
      if (a.isAccepted === b.isAccepted) {
        return new Date(b.ans_date_time) - new Date(a.ans_date_time);
      }
      return b.isAccepted - a.isAccepted;
    });
    setAnswers(sortedAnswers);
  }, [question.answers]);

  const handleAcceptAnswer = (answerId) => {
    axios.post(`http://localhost:8000/questions/${question._id}/answers/${answerId}/accept`, {}, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      if (response.status === 200) {
        console.log("Answer accepted ..");
        // Update the answers array to reflect the accepted answer at the top
        const updatedAnswers = answers.map((answer) =>
        answer._id === answerId ? { ...answer, isAccepted: true } : answer
        );
        setAnswers(updatedAnswers);
      } else {
        // Handle error scenario if the request fails
      }
    })
    .catch((error) => {
      // Handle any network errors or exceptions
      console.log(error);
    });
  };

  

  const handleNext = () => {
    setStartIndex((prevIndex) =>
      prevIndex + answersPerPage >= answers.length ? 0 : prevIndex + answersPerPage
    );
  };

  const handlePrev = () => {
    setStartIndex((prevIndex) =>
      prevIndex - answersPerPage < 0 ? 0 : prevIndex - answersPerPage
    );
  };

  const visibleAnswers = answers.slice(startIndex, startIndex + answersPerPage);
  const isMultiplePages = answers.length > answersPerPage;
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
            disabled={startIndex + answersPerPage >= answers.length}
          >
            Next
          </button>
        </div>
      )
    );
  };

  return (
    <div>
      <div id='questionInfo'>
        <div className='voteContainer'>
          {isLoggedIn ? (
            <>
              <button id="increaseVoteCount" onClick={() => handleVote('Upvote','Question',question._id)}>Upvote</button>
              <div className="questionVotes">{question.votes} votes</div>
              <button id="decreaseVoteCount" onClick={() => handleVote('Downvote','Question',question._id)}>Downvote</button>
            </>
          ) : (
            <>
              <div className="questionVotes">{question.votes} votes</div>
            </>
          )}
        </div>
        <div className='qTextElements'>
          <div id="answersHeader">
            <div id="answerCount">{question.answers.length} answers</div>
            <div id="questionTitle">{question.title}</div>
            <button id="askQuestion" onClick={() => onAskQuestionClick('')}>
              Ask a Question
            </button>
          </div>

          <div id="questionBody">
            <div id="views">{question.views} views</div>

            <div id="questionText">
              <HyperlinkRenderer text={question.text} />
            </div>

            <div className="lastActivity">
              {`${question.asked_by.username} asked ${formatDate(new Date(question.ask_date_time))}`}
            </div>
          </div>
        </div>
      </div>
      
      <div id= 'qComments'>
        <CommentList
          comments={question.comments}
          handleVote={handleVote}
          handleCommentSubmit={handleCommentSubmit}
          parentObjectType={'Question'}
          parentObjectID={question._id}
        />
      </div>

      <div id="ansList">
        {visibleAnswers.map((answer) => (
          <div key={answer._id} id='answerContainer'>
            <div id="answer">
              <div className='voteContainer'>
                {isLoggedIn ? (
                  <>
                    <button id="increaseVoteCount" onClick={() => handleVote('Upvote','Answer',answer._id)}>Upvote</button>
                    <div className="questionVotes">{answer.votes} votes</div>
                    <button id="decreaseVoteCount" onClick={() => handleVote('Downvote','Answer',answer._id)}>Downvote</button>
                  </>
                ) : (
                  <>
                    <div className="questionVotes">{answer.votes} votes</div>
                  </>
                )}
              </div>

              <div className="answerText">
                <HyperlinkRenderer text={answer.text} />
              </div>

              <div className="answerAuthor">
                {`${answer.ans_by.username} answered ${formatDate(new Date(answer.ans_date_time))}`}
              </div>

              {/* Conditional rendering of the 'Accept' button */}
              {isLoggedIn && isQuestionOwner && !answer.isAccepted && (
                <button onClick={() => handleAcceptAnswer(answer._id)}>Accept</button>
              )}
            </div>
            <div id = 'aComments'>
              <CommentList
                comments={answer.comments}
                handleVote={handleVote}
                handleCommentSubmit={handleCommentSubmit}
                parentObjectType={'Answer'}
                parentObjectID={answer._id}
              />
            </div>
          </div>
        ))}
        {renderPaginationButtons()}
      </div>
      {isLoggedIn && (
        <button id="ansQuestion" onClick={onAnsQuestionClick}>
          Answer Question
        </button>
      )}
    </div>
  );

  }

AnswerList.propTypes = {
  question: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    votes: PropTypes.number.isRequired,
    answers: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        ans_by: PropTypes.shape({
          _id: PropTypes.string.isRequired,
          username: PropTypes.string.isRequired
        }).isRequired,
        ans_date_time: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        comments: PropTypes.array.isRequired,
      })
    ).isRequired,
    title: PropTypes.string.isRequired,
    views: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    asked_by: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired
    }).isRequired,
    ask_date_time: PropTypes.string.isRequired,
    comments: PropTypes.arrayOf( PropTypes.shape({
  _id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  comment_by: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
  }).isRequired,
  votes: PropTypes.number.isRequired,
  cmnt_date_time: PropTypes.string, // Adjust the type as needed
})),
  }).isRequired,
  onAskQuestionClick: PropTypes.func.isRequired,
  onAnsQuestionClick: PropTypes.func.isRequired,
  handleVote: PropTypes.func.isRequired,
  handleCommentSubmit: PropTypes.func.isRequired,
};

export default AnswerList;
