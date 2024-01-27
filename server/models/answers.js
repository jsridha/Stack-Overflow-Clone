const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AnswerSchema = new Schema(
  {
    text: { type: String, required: true },
    ans_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    ans_date_time: { type: Date, required: true, default: Date.now },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment', required: false, default: [] }],
    votes: { type: Number, required: false, default: 0 }
  }
);

module.exports = mongoose.model('Answer', AnswerSchema);
