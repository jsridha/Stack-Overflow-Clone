const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TagSchema = new Schema({
  name: { type: String, required: true },
  created_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

const Tag = mongoose.model('Tag', TagSchema);

module.exports = Tag;
