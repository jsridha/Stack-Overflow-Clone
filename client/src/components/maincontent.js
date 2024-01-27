import React from 'react';
import PropTypes from 'prop-types';
import { QuestionList } from './questionlist.js';
import AnswerList from './answerlist.js';
import { TagsPage } from './tagspage.js';
import AnswerForm from './answerform.js';
import QuestionForm from './questionform.js';
import LoginPage from './loginpage.js';
import UserProfile from './userprofile/userprofile.js';

function MainContent({
  displayComponent,
  questions,
  qTotal,
  onSortButtonClick,
  onAskQuestionClick,
  onQuestionClick,
  question,
  onAnsQuestionClick,
  tags,
  onTagClick,
  qFormData,
  setQuestionFormData,
  onQuestionSubmit,
  aFormData,
  setAnswerFormData,
  handleAnswerSubmission,
  handleVote,
  handleCommentSubmit,
  setErrorMessage,
  handleAcceptAnswer
}) {

  if (displayComponent === 'questionList') {
    return (
      <QuestionList
        questions={questions}
        qTotal={qTotal}
        onSortButtonClick={onSortButtonClick}
        onAskQuestionClick={onAskQuestionClick}
        onQuestionClick={onQuestionClick}
      />
    );
  } else if (displayComponent === 'viewQuestion') {
    return (
      <AnswerList
            question={question}
            onAskQuestionClick={onAskQuestionClick}
            onAnsQuestionClick={onAnsQuestionClick}
            handleVote={handleVote}
            handleCommentSubmit={handleCommentSubmit}
            handleAcceptAnswer={handleAcceptAnswer}
      />
    );
  } else if (displayComponent === 'viewAllTags') {
    return (
      <TagsPage
        tags={tags}
        onAskQuestionClick={onAskQuestionClick}
        onTagClick={onTagClick}
      />
    );
  } else if (displayComponent === 'askQuestionForm') {
    return (
      <QuestionForm
        formData={qFormData}
        setFormData={setQuestionFormData}
        onQuestionSubmit={onQuestionSubmit}
      />
    )
  } else if (displayComponent === 'answerQuestionForm') {
    return (
      <AnswerForm
        formData={aFormData}
        setFormData={setAnswerFormData}
        onAnswerSubmit={handleAnswerSubmission}
      />
    )
  } else if (displayComponent === 'loginPage'){
    return <LoginPage />
  } else if (displayComponent === 'userProfile'){
    return <UserProfile setErrorMessage={setErrorMessage} />
  }

  else {
    return null;
  }
}

MainContent.propTypes = {
  displayComponent: PropTypes.string.isRequired,
  questions: PropTypes.array.isRequired,
  qTotal: PropTypes.number.isRequired,
  onSortButtonClick: PropTypes.func.isRequired,
  onAskQuestionClick: PropTypes.func.isRequired,
  onQuestionClick: PropTypes.func.isRequired,
  question: PropTypes.object,
  onAnsQuestionClick: PropTypes.func.isRequired,
  tags: PropTypes.array.isRequired,
  onTagClick: PropTypes.func.isRequired,
  qFormData: PropTypes.object,
  setQuestionFormData: PropTypes.func,
  onQuestionSubmit: PropTypes.func,
  aFormData: PropTypes.object,
  setAnswerFormData: PropTypes.func,
  handleAnswerSubmission: PropTypes.func,
  handleVote: PropTypes.func.isRequired,
  handleCommentSubmit: PropTypes.func.isRequired,
  setErrorMessage: PropTypes.func.isRequired,
  handleAcceptAnswer: PropTypes.func.isRequired
};

export default MainContent;
