import React from 'react'
import PropTypes from 'prop-types';

export function TagsPage({ tags, onAskQuestionClick, onTagClick }) {
    
    return (
        <div>
            <div>
                <div id="tagsHeader">
                    <div id="tagCount">
                        <h1>{tags.length} Tags</h1>
                    </div>
                    
                    <div id="tagTitle">
                        <h1>All Tags</h1>
                    </div>
                    
                    <button onClick={() => onAskQuestionClick('')}>Ask a Question</button>
                </div>

                <div id="tagGroups">
                    {tags.map((tag) => (
                        <div className="tagNode" key={tag._id}>
                            <button onClick={() => onTagClick('tags', tag._id)}>
                                {tag.name}
                            </button>
                            
                            <div>
                                {tag.questionCount === 1
                                ? `${tag.questionCount} question`
                                : `${tag.questionCount} questions`}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

TagsPage.propTypes = {
  tags: PropTypes.array.isRequired,
  onAskQuestionClick: PropTypes.func.isRequired,
  onTagClick: PropTypes.func.isRequired,
};

export default TagsPage;