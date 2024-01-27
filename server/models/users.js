const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now },

  questions: [{ type: Schema.Types.ObjectId, ref: 'Question', required: false, default:[]}],
  answers: [{ type: Schema.Types.ObjectId, ref: 'Answer', required: false, default:[]}],
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag', required: false, default:[]}],

  reputation: { type: Number, required: false, default: 0}
});

module.exports = mongoose.model('User', UserSchema);
