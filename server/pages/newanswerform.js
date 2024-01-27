let Question = require('../models/questions');
let User = require('../models/users');
let { createElement } = require('../models/itemFactory');

exports.answer_submission = async function(req, res, qid) {
    try {
        const { text } = req.body;

        const currentUser = await User.findById(req.session.userID);
        // Use the itemFactory to create a new Answer
        let answer = createElement('Answer', {
            text: text,
            ans_by: currentUser,
            ans_date_time: new Date()
        });

        const savedAnswer = await answer.save();
        // Find the question by ID
        const question = await Question.findById(qid).populate('answers')

        // Push the saved answer to the question's answers array
        question.answers.push(savedAnswer);
        question.lastActive = Date.now();
        currentUser.answers.push(savedAnswer);
        question.lastActive = new Date();

        // Save the updated question
        await question.save();
        await currentUser.save();

        res.status(200).json({ message: 'Answer created successfully', answer: savedAnswer });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
