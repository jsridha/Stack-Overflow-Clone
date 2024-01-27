const Question = require('../models/questions');
const Answer = require('../models/answers');
const Tag = require('../models/tags');
const User = require('../models/users');
const Comment = require('../models/comments');

const deleteQuestion = async(qID, currentUser) => {
    try {
        const question = await Question.findById(qID);

        if (!question) {
            throw new Error('Question not found' );
        }

        if (question.asked_by.toString() !== currentUser._id.toString()) {
            throw new Error('You cannot delete this question' );
        }

        question.answers.forEach(async(answer) => {
            await deleteAnswer(answer._id, currentUser);
        });
        await Comment.deleteMany({_id: {$in: question.comments } });
        
        if (question.accepted_answer) {
            await question.accepted_answer.deleteOne();
        }
        // Delete the question
        await question.deleteOne();

        // Remove the deleted question from the user's questions array
        await User.updateOne(
            { _id: currentUser._id },
            { $pull: { questions: qID } }
        );

        return { message: 'Question deleted successfully' };
    } catch (error) {
        throw new Error(error.message);
    }   
};

const deleteAnswer = async(aID, currentUser) => {
    try {
        const answer = await Answer.findById(aID);

        if (!answer) {
            throw new Error('Answer not found' );
        }

        // Delete the answer and associated votes and comments
        await Comment.deleteMany({ _id: { $in: answer.comments } })

        // Find and update associated question's last active field
        const associatedQuestion = await Question.findOne({ answers:answer._id})
        if(!associatedQuestion) {
            await answer.deleteOne();
            return ({ message: 'Answer deleted successfully' });
        } else {
            associatedQuestion.lastActive = Date.now();
            await associatedQuestion.save();
            await answer.deleteOne();

            // Remove the deleted question from the user's answers array
            await User.updateOne(
                { _id: currentUser._id },
                { $pull: { answers: aID } }
            );

            return ({ message: 'Answer deleted successfully' });
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

const deleteTag = async(tID, currentUser) => {
    try {
        const tag = await Tag.findById(tID);

        if (!tag) {
            throw new Error('Tag not found');
        }

        if (tag.created_by.toString() !== currentUser._id.toString()) {
            throw new Error('You cannot delete this tag' );
        }

        const associatedQuestions = await Question.find({ tags: tag._id }) // Find questions with the tag's ID in their tags array

        if (!associatedQuestions) {
            await tag.deleteOne();

            // Remove the deleted question from the user's answers array
            await User.updateOne(
                { _id: currentUser._id },
                { $pull: { tags: tID } }
            );

            return { message: 'Tag deleted successfully' };
        }

        // Step 2: Extract the unique set of User IDs who posted those questions
        const uniqueUserIDs = (associatedQuestions.map((q) => q.asked_by._id));

        // Step 3: Compare User IDs to currentUserID
        let allUsersEqualCurrentUser = true;
        uniqueUserIDs.forEach((userID) => {
            if (userID.toString() !== currentUser._id.toString()) {
                allUsersEqualCurrentUser = false;
            }
        });

        if (allUsersEqualCurrentUser) {
            // Delete the tag from all associated questions
            await Question.updateMany(
                { tags: tag._id },
                { $pull: { tags: tag._id } }
            );
            // Delete the tag
            await tag.deleteOne();

            // Remove the deleted question from the user's answers array
            await User.updateOne(
                { _id: currentUser._id },
                { $pull: { tags: tID } }
            );

            return { message: 'Tag deleted successfully' };
        } else {
            throw new Error('This tag is being used by other users, so it cannot be deleted.');
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

exports.delete_object = async (req, res) => {
    const { objectType, objectID } = req.params;

    let currentUser = await User.findById(req.session.userID);

    try {
        switch (objectType) {
            case 'question':
                await deleteQuestion(objectID, currentUser);
                return res.status(200).json({message: 'question deleted'});

            case 'answer':
                await deleteAnswer(objectID, currentUser);
                return res.status(200).json({message: 'answer deleted'});

            case 'tag':
                await deleteTag(objectID, currentUser);
                return res.status(200).json({message: 'tag deleted'});

        default:
            return res.status(400).json({ error: 'Invalid object type' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};