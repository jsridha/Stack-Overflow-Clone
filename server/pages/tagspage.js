let Tag = require('../models/tags');
let Question = require('../models/questions'); // Add this line

exports.show_tagsPage = async function (res) {
    try {
        const tagsWithCount = await Tag.aggregate([
            {
                $lookup: {
                    from: 'questions',
                    localField: '_id',
                    foreignField: 'tags',
                    as: 'questions'
                }
            },
            {
                $project: {
                    name: 1,
                    questionCount: { $size: "$questions" }
                }
            }
        ]);

        res.json(tagsWithCount);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.show_tagPage = async function (res, tagId) {
    try {
        const questions = await Question.find({ tags: tagId }).populate({
                path: 'tags',
                select: 'name'
            }).populate({
                path: 'answers',
                select: 'ans_date_time'
            }).sort({ ask_date_time: -1 });
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: 'Error getting questions for tag' });
    }
};