let Question = require('../models/questions');
let Answer = require('../models/answers');
let User = require('../models/users');
let { createElement } = require('../models/itemFactory');

exports.submit_comment = async function(req, res) {
    try {

        const user = await User.findById(req.session.userID);
        if (user.reputation < 50) {
            throw new Error('Users must have a reputation of 50 or greater in order to leave comments');
        }

        const {objectType, objectID, commentText, qID} = req.body;
        
        if (commentText.length > 140) {
            throw new Error('Comments must be 140 characters or less');
        }

        const newComment = createElement('Comment', {
            text: commentText,
            comment_by: user,
            votes: 0,
            cmnt_date_time: Date.now()
        });
        await newComment.save();

        let object;
        switch (objectType) {
            case 'Question':
                object = await Question.findById(objectID);
                break;
            case 'Answer': 
                object = await Answer.findById(objectID);
                break;
        }

        object.comments.push(newComment);
        await object.save();
        await user.save();

        const updatedQuestion = await Question.findById(qID)
        .populate({
                path: 'answers',
                options: { sort: { ans_date_time: -1 } },
                populate: [
                    {
                        path: 'comments',
                        options: { sort: { cmnt_date_time: 1 } }, // Sort comments by cmnt_date_time in ascending order
                        populate: { path: 'comment_by', select: 'username' }
                    },
                    {
                        path: 'ans_by',
                        select: 'username'
                    }
                ]
            })
            .populate({
                path: 'comments',
                options: { sort: { cmnt_date_time: 1 } }, // Sort comments by cmnt_date_time in ascending order
                populate: {
                    path: 'comment_by',
                    select: 'username'
                }
            })
            .populate({
                path: 'asked_by',
                select: 'username'
            });  

        updatedQuestion.lastActive = Date.now();
        await updatedQuestion.save();
        
        res.status(200).json({ message: 'Comment submitted', question: updatedQuestion });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}