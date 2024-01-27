import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../utils/formatdate.js';

export function QuestionList({
  questions,
  qTotal,
  onSortButtonClick,
  onAskQuestionClick,
  onQuestionClick,
}) {
  const [startIndex, setStartIndex] = useState(0);
  const questionsPerPage = 5;

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

  const visibleQuestions = questions.slice(startIndex, startIndex + questionsPerPage);
  const isMultiplePages = questions.length > questionsPerPage;
  const isFirstPage = startIndex === 0;

  const sortQuestionsByDate = () => {
    onSortButtonClick('questions', '', 'newest');
  };

  const sortQuestionsByActivity = () => {
    onSortButtonClick('questions', '', 'active');
  };

  const filterUnansweredQuestions = () => {
    onSortButtonClick('questions', '', 'unanswered');
  };

  const truncateText = (text, maxLength) => {
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
      }
      return text;
  };

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

  const hasAccepted = (question) => {
    if (question.accepted_answer) {
      return true;
    } else {
      return false;
    }
  }

  const renderQuestions = () => {
    return (
      <div id="qList">
        {visibleQuestions.map((question) => (
          <div
            key={question._id}
            id="questionDiv"
            className="question"
            onClick={() => onQuestionClick('questions', question._id)}
          >

            {/* Display question details */}
            {hasAccepted(question) ? (
              <div className="postStats">
                {question.answers.length + 1} answers <br /> {question.views} views <br /> {question.votes} votes
              </div>
            ) : (
              <div className="postStats">
                {question.answers.length} answers <br /> {question.views} views <br /> {question.votes} votes
              </div>
            )}

            <div className="questionDivCenter">
              <div className="postTitle">Title: {question.title}</div>

              <div className="questionSummary">Summary: {truncateText(question.text, 50)}</div>

              <div className="tagsContainer">
                {question.tags.map((tag) => (
                  <div key={tag._id} className="tag">
                    {tag.name}
                  </div>
                ))}
              </div>
            </div>

            <div className="lastActivity">
              {`${question.asked_by.username} asked ${formatDate(new Date(question.ask_date_time))}`}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div id="title">
        <div id="titlecontent">
          <h1>
            {questions.length === 0
              ? 'No Questions Found'
              : qTotal === questions.length
              ? 'All Questions'
              : questions.length === 1
              ? '1 Question'
              : `${questions.length} Questions`}
          </h1>
          <button onClick={() => onAskQuestionClick('questions', '', 'newest')}>
            Ask a Question
          </button>
        </div>
      </div>

      <div id="subtitle">
        <div id="subtitlecontent">
          <div id="qCount">
            {questions.length === 1 ? '1 question' : `${questions.length} questions`}
          </div>
          <div id="sortButtons">
            <button onClick={sortQuestionsByDate}>Newest</button>
            <button onClick={sortQuestionsByActivity}>Active</button>
            <button onClick={filterUnansweredQuestions}>Unanswered</button>
          </div>
        </div>
      </div>

      {renderQuestions()}

      {renderPaginationButtons()}
    </div>
  );
}

QuestionList.propTypes = {
  questions: PropTypes.array.isRequired,
  qTotal: PropTypes.number.isRequired,
  onSortButtonClick: PropTypes.func.isRequired,
  onAskQuestionClick: PropTypes.func.isRequired,
  onQuestionClick: PropTypes.func.isRequired,
};

export default QuestionList;
