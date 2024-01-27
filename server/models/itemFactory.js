const Question = require("./questions.js");
const Answer = require("./answers.js");
const Tag = require("./tags.js");
const User = require("./users.js")
const Comment = require("./comments.js"); 

const element = { Question, Answer, Tag, User, Comment };

exports.createElement = function(type, attributes) {
    const ElementType = element[type];

    return new ElementType(attributes);
}