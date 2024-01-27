import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../utils/formatdate.js';
import axios from 'axios';
axios.defaults.withCredentials = true;
import { useAuth } from './AuthContext';

function CommentList({ comments, handleVote, handleCommentSubmit, parentObjectType, parentObjectID } ) {
    const [startIndex, setStartIndex] = useState(0);
    const commentsPerPage = 3;
    const { isLoggedIn } = useAuth();
    const [newCommentText, setNewCommentText] = useState('');

    const handleNext = () => {
        setStartIndex((prevIndex) =>
            prevIndex + commentsPerPage >= comments.length ? 0 : prevIndex + commentsPerPage
        );
    };

    const handlePrev = () => {
        setStartIndex((prevIndex) =>
            prevIndex - commentsPerPage < 0 ? 0 : prevIndex - commentsPerPage
        );
    };

    const handleNewCommentChange = (event) => {
        setNewCommentText(event.target.value);
    };

    const handleCommentInputKeyDown = useCallback((event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Prevents default behavior (new line)
            handleCommentSubmit(parentObjectType, parentObjectID, newCommentText);
            setNewCommentText(''); // Clear the textarea
        }
    }, [newCommentText]);

    useEffect(() => {
        const searchInput = document.getElementById('searchBar');
        searchInput.addEventListener('keydown', handleCommentInputKeyDown);

        return () => {
            searchInput.removeEventListener('keydown', handleCommentInputKeyDown);
        };
    }, [handleCommentInputKeyDown])

    const visibleComments = comments.slice(startIndex, startIndex + commentsPerPage);
    const isMultiplePages = comments.length > commentsPerPage;
    const isFirstPage = startIndex === 0;

    const renderPaginationButtons = () => {
        return (
            isMultiplePages && (
                <div className="paginationButtons">
                    <button onClick={handlePrev} disabled={isFirstPage}>
                        Prev
                    </button>
                    <button onClick={handleNext} disabled={startIndex + commentsPerPage >= comments.length}>
                        Next
                    </button>
                </div>
            )
        );
    };

    const renderNewCommentInput = () => {
        return (
            isLoggedIn && (
                <div className="newCommentContainer">
                    <textarea
                        type="text"
                        placeholder="Add a new comment..."
                        value={newCommentText}
                        onChange={handleNewCommentChange}
                        onKeyDown={handleCommentInputKeyDown}
                    />
                </div>
            )
        );
    };

    const renderComments = () => {
        return (
            <div id="commentList">
                {visibleComments.map((comment) => (
                    <div key={comment._id} id="commentDiv" className="comment">
                        <div className='voteContainer'>
                            {isLoggedIn ? (
                                <>
                                    <button id="increaseVoteCount" onClick={() => handleVote('Upvote','Comment',comment._id)}>Upvote</button>
                                    <div className="commentVotes">{comment.votes} votes</div>
                                </>
                            ): (
                                <>
                                    <div className="commentVotes">{comment.votes} votes</div>
                                </>
                            )}
                        </div>

                        <div className="commentText">{comment.text}</div>

                        <div className="commentDetails">
                            {`${comment.comment_by.username} | ${formatDate(new Date(comment.cmnt_date_time))}`}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div>
            {renderComments()}
            {renderPaginationButtons()}
            {renderNewCommentInput()}
        </div>
    );
}

CommentList.propTypes = {
    comments: PropTypes.array.isRequired,
    handleVote: PropTypes.func.isRequired,
    handleCommentSubmit: PropTypes.func.isRequired,
    parentObjectType: PropTypes.string.isRequired,
    parentObjectID: PropTypes.string.isRequired,
};

export default CommentList;