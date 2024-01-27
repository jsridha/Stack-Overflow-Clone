let Tag = require('../models/tags');
let Question = require('../models/questions');

async function searchText(term) {
    try {
        // Case-insensitive search for questions containing the specified term in title or text
        const regex = new RegExp(term, 'i');
        const matchingQuestions = await Question.find({
            $or: [
                { title: { $regex: regex } },
                { text: { $regex: regex } }
            ]
        })
        .populate('tags', 'name')
        .populate('answers', 'ans_date_time')
        .exec();

        return matchingQuestions;
    } catch (error) {
        console.error('Error searching text:', error);
        throw error;
    }
}

async function searchTags(term) {
    try {
        const results = [];
        // Find the tag with the given name
        const tag = await Tag.findOne({ name: term });

        if (tag) {
            // Find questions that contain the specified tag
            const matchingQuestions = await Question.find({ 
                tags: tag 
            })
            .populate('tags', 'name')
            .populate('answers', 'ans_date_time')
            .exec();

            // Append matching questions to the input array
            results.push(...matchingQuestions);

            return results;
        } else {
            return results;
        }
    } catch (error) {
        console.error('Error searching tags:', error);
        throw error;
    }
}

exports.search_questions = async function(res, searchString) {
    try {
        // Split searchString on white spaces to generate an array of search terms
        const searchTerms = searchString.split(/\s+/);

        // Array to store questions from both text and tag searches
        let searchResults = [];

        // Iterate through search terms
        for (const term of searchTerms) {
            // Check if the term is a tag (enclosed in [])
            if (term.startsWith('[') && term.endsWith(']')) {
                // Extract tag name without brackets
                const tagName = term.slice(1, -1);
                // Use searchTags method to find questions associated with the tag
                const tagQuestions = await searchTags(tagName, []);
                searchResults.push(...tagQuestions);
            } else {
                // Use searchText method to find questions associated with the text
                const textQuestions = await searchText(term);
                searchResults.push(...textQuestions);
            }
        }

        // Sort combinedResults based on the ask_date_time in descending order
        searchResults.sort((a, b) => b.ask_date_time - a.ask_date_time);

        // Respond with the final set of questions
        res.json({ searchResults });
    } catch (error) {
        res.status(500).json({ error: 'Error performing search:', details: error.message });
    }
}
