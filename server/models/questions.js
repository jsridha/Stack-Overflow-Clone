// Question Document Schema
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var QuestionSchema = new Schema(
    {   
        title: {type: String, required: true},
        text: {type: String, required: true},
        tags: [{ type: Schema.Types.ObjectId, ref: 'Tag', required: true, default:[]}],
        asked_by: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        ask_date_time: {type: Date, required: true, default: new Date()},
        answers: [{ type: Schema.Types.ObjectId, ref: 'Answer', required: true, default:[]}],
        views: {type: Number, default: 0},

        comments: [{type: Schema.Types.ObjectId, ref: 'Comment', required: false, default:[]}],
        accepted_answer: {type: Schema.Types.ObjectId, ref: 'Answer', required: false},
        votes: {type: Number, required: false, default: 0},
        lastActive: {type: Date, required: true, default: new Date()}
    }
);

module.exports = mongoose.model('Question', QuestionSchema);