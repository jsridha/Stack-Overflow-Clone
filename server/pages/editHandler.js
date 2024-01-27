const Question = require('../models/questions');
const Answer = require('../models/answers');
const Tag = require('../models/tags');
const User = require('../models/users');
let { createElement } = require('../models/itemFactory');

const edit_question = async(qID, formData, currentUser) => {
    try {
        const question = await Question.findById(qID);

        if (!question) {
            throw new Error('Question not found' );
        }

        if (question.asked_by.toString() !== currentUser._id.toString()) {
            throw new Error('You cannot edit this question' );
        }

        question.title = formData.newTitle;
        question.text = formData.newText;
        const tagObjects = await Promise.all(formData.newTags.map(async (tagName) => {
            let tag = await Tag.findOne({ name: tagName });

            if (!tag) {
                if (currentUser.reputation < 50) {
                    throw new Error('Cannot create new tags when reputation is below 50');
                }

                // If the tag doesn't exist, create a new one using the itemFactory
                tag = createElement('Tag', { 
                    name: tagName,
                    created_by: currentUser 
                });
                await tag.save();
            }

            return tag;
        }));
        question.tags = tagObjects;
        question.lastActive = Date.now();
        await question.save();

        return { message: 'Question updated successfully' };
    } catch (error) {
        throw new Error(error.message);
    }
};

const edit_answer = async(aID, formData, currentUser) => {
    try {
        const answer = await Answer.findById(aID);
        

        if (!answer) {
            throw new Error('Answer not found' );
        }

        if (answer.ans_by.toString() !== currentUser._id.toString()) {
            throw new Error('You cannot delete this answer' );
        }

        answer.text = formData.newText;
        await answer.save();
        
        // Find and update associated question's last active field
        const associatedQuestion = await Question.findOne({ answers:answer._id});
        if(!associatedQuestion) {
            return ({ message: 'Answer edited successfully' });
        } else {
            associatedQuestion.lastActive = Date.now();
            await associatedQuestion.save();
        }

        return ({ message: 'Answer edited successfully' });
    } catch (error) {
        throw new Error(error.message);
    }
};

const edit_tag = async(tID, formData, currentUser) => {
    try {
        const tag = await Tag.findById(tID);

        if (!tag) {
            throw new Error('Tag not found');
        }

        if (tag.created_by.toString() !== currentUser._id.toString()) {
            throw new Error('You cannot delete this tag' );
        }

        const associatedQuestions = await Question.find({ tags: tag._id }) // Fi

        if (!associatedQuestions) {
            tag.name = formData.newName;
            await tag.save();
            return { message: 'Tag edited successfully' };
        }

        // Step 2: Extract the unique set of User IDs who posted those questions
        const uniqueUserIDs = (associatedQuestions.map((q) => q.asked_by._id));

        let allUsersEqualCurrentUser = true;
        uniqueUserIDs.forEach((userID) => {
            if (userID.toString() !== currentUser._id.toString()) {
                allUsersEqualCurrentUser = false;
            }
        });

        if (allUsersEqualCurrentUser) {
            tag.name = formData.newName;
            await tag.save();
            return { message: 'Tag updated successfully' };
        } else {
            throw new Error('This tag is being used by other users, so it cannot be edited.');
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

exports.edit_object = async(req, res) => {
    const {objectType, objectID} = req.params;
    const formData = req.body;
    const currentUser = await User.findById(req.session.userID);

    try {
        switch (objectType) {
            case 'question':
                await edit_question(objectID, formData, currentUser);
                return res.status(200).json({message: 'question edited'});

            case 'answer':
                await edit_answer(objectID, formData, currentUser);
                return res.status(200).json({message: 'answer edited'});

            case 'tag':
                await edit_tag(objectID, formData, currentUser);
                return res.status(200).json({message: 'tag edited'});

            default:
                return res.status(400).json({ error: 'Invalid object type' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};
