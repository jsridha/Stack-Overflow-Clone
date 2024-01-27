// Comment Document Schema
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CommentSchema = new Schema(
    {   
        text: {type: String, required: true},
        comment_by: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        votes: {type: Number, required: true},
        cmnt_date_time: {type: Date, required: false, default: Date.now}
    }
);

module.exports = mongoose.model('Comment', CommentSchema);