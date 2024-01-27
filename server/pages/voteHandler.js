let Question = require('../models/questions');
let Answer = require('../models/answers');
let Comment = require('../models/comments');
let User = require('../models/users');

exports.updateVotes = async function(req, res) {
    try {
        const {voteType, objectType, objectID, qID} = req.body

        let object;
        let user;

        switch (objectType) {
            case 'Question':
                object = await Question.findById(objectID);
                user = await User.findById(object.asked_by);
                break;
            case 'Answer': 
                object = await Answer.findById(objectID);
                user = await User.findById(object.ans_by);
                break;
            case 'Comment':
                object = await Comment.findById(objectID);
                user = await User.findById(object.comment_by);
                break;
        }

        switch (voteType) {
            case 'Upvote':
                object.votes++;
                if (objectType === 'Question' || objectType === 'Answer') {
                    user.reputation += 5;
                }
                break;
            case 'Downvote':
                object.votes--;
                if (objectType === 'Question' || objectType === 'Answer') {
                    user.reputation -= 10;
                }
                break;
        }

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
            });;
            
        updatedQuestion.lastActive = Date.now();
        await updatedQuestion.save();
        
        res.status(200).json({ message: 'Vote successfully recorded', question: updatedQuestion });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}