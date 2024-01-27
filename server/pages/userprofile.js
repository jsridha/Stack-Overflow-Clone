const User = require('../models/users.js');

exports.get_UserDetails = async function (req, res, userId) {
    try {
      const user = await User.findById(userId)
        .populate({
          path: 'questions',
          populate: {
            path: 'tags',
            select: 'name', // Only select the 'name' field from the 'tags' documents
          },
        })
        .populate({ 
          path: 'answers' 
        }).populate({ 
          path: 'tags' 
        });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ user });
    } catch (error) {
      console.error('Error fetching user details:', error);
      res.status(500).json({ message: 'Server error' });
    }
}