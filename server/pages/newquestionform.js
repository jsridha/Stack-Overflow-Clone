let Tag = require('../models/tags');
let User = require('../models/users');
let { createElement } = require('../models/itemFactory');

exports.question_submission = async function (req, res) {
    try {
        const { title, text, tags } = req.body;
        const tagString = tags.split(' ');

        const currentUser = await User.findById(req.session.userID);

        // Fetch ObjectIds for the provided tag names
        const tagObjects = await Promise.all(tagString.map(async (tagName) => {
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


        // Create a new Question using the retrieved Tag instances
        let question = createElement('Question', {
            title: title,
            text: text,
            tags: tagObjects,
            asked_by: currentUser,
            ask_date_time: Date.now(),
            answers: [],
            views: 0,
            lastActive: Date.now()
        });

        const savedQuestion = await question.save();
        currentUser.questions.push(savedQuestion);
        await currentUser.save();

        res.status(200).json({ message: 'Question created successfully', question: savedQuestion });
    } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};
