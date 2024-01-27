const express = require('express');
const app = express();
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = 8000;

// Import modules
const QuestionsPage = require('./pages/questionspage');
const TagsPage = require('./pages/tagspage');
const NewQuestion = require('./pages/newquestionform');
const NewAnswer = require('./pages/newanswerform');
const SearchHelper = require('./pages/searchHelper');
let { show_registerPage } = require('./pages/registerpage');
let { show_loginPage, checkLoginStatus } = require('./pages/loginpage');
let welcomeRouter = require('./pages/welcomepage');
const VoteHandler = require('./pages/voteHandler');
const SubmitComment = require('./pages/commentsubmission');
const UserProfile = require('./pages/userprofile');
const DeleteHandler = require('./pages/deleteHandler');
const EditHandler = require('./pages/editHandler'); 

// Establish connection to DB
let mongoose = require('mongoose');
let mongoDB = 'mongodb://127.0.0.1:27017/fake_so';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('connected', function () {
  console.log('Connected to database');
});

const cookieParser = require('cookie-parser');

// Middleware setup
const secret = process.argv[2];
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
  secret: `${secret}`,
  cookie: {
    httpOnly: true,
    sameSite: true,
  },
  resave: false,
  saveUninitialized: false
}));
app.use(cookieParser());

app.use('/welcome', welcomeRouter);

app.post('/register', (req, res) => {
  show_registerPage(req, res, req.session);
});

app.post('/login', async (req, res) => {
  try {
    const updatedSession = await show_loginPage(req, res, req.session);

    if (updatedSession.loggedIn) {
      res.status(200).json({ isLoggedIn: req.session.loggedIn, userID: req.session.userID });
    } else {
      res.status(401).json({ message: 'Login failed' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/logout', async (req, res) => {
  req.session.destroy(err => {
    res.redirect("/")
  })
});

app.get('/sessionInfo', async (req, res) => {
  try {
    res.json({isLoggedIn: req.session.loggedIn, userID: req.session.userID});
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});

app.get('/', async (req, res) => {
  try {
    res.json({ "message": "Welcome to Fake Stack Overflow!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

let questions = []
app.get('/questions/newest', async (req, res) => {
  questions = await QuestionsPage.show_questions_by_askDate(res);
});

app.get('/questions/active', async (req, res) => {
  QuestionsPage.show_questions_by_ansDate(res);
});

app.get('/questions/unanswered', async (req, res) => {
  QuestionsPage.show_only_unanswered(res);
});

app.get('/questions/:questionId/answers', async (req, res) => {
  const { questionId } = req.params;
  QuestionsPage.show_Question(res, questionId);
});

app.get('/tags', async (req, res) => {
  TagsPage.show_tagsPage(res);
});

app.get('/tags/:tagId', async (req, res) => {
  const { tagId } = req.params;
  TagsPage.show_tagPage(res, tagId);
});

app.post('/newQuestionForm', async (req, res) => {
  NewQuestion.question_submission(req, res);
});

app.post('/questions/:qid/answerQuestionForm', async (req, res) => {
  const { qid } = req.params;
  NewAnswer.answer_submission(req, res, qid);
});

app.post('/vote', async (req, res) => {
  VoteHandler.updateVotes(req, res);
})

app.post('/commentSubmit', async (req, res) => {
  SubmitComment.submit_comment(req, res);
})

app.get('/search/:searchString', async (req, res) => {
  const { searchString } = req.params;
  SearchHelper.search_questions(res, searchString);
});

// Add this route to handle pagination based on the number of pages
app.get('/questions/page/:pageNumber', async (req, res) => {
  const { pageNumber } = req.params;
  const { questionsPerPage } = req.query;

  try {
    // Logic to calculate the startIndex based on pageNumber and questionsPerPage
    const startIndex = (pageNumber - 1) * questionsPerPage;

    // Assuming 'questions' is an array of all available questions
    const paginatedQuestions = questions.slice(startIndex, startIndex + questionsPerPage);

    res.json({ paginatedQuestions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/users/:userId', async (req, res) => {
  const { userId } = req.params;
  UserProfile.get_UserDetails(req, res, userId);
});

app.post('/edit/:objectType/:objectID', async (req, res) =>  {
  EditHandler.edit_object(req, res);
});

app.post('/delete/:objectType/:objectID', async (req, res) =>  {
  DeleteHandler.delete_object(req, res);
});

// Add a new route to mark an answer as accepted
app.post('/questions/:questionId/answers/:answerId/accept', async (req, res) => {
  QuestionsPage.acceptAnswer(req,res);
});

const server = app.listen(PORT, () => {
  console.log(`Server is running at https://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  server.close(() => {
    mongoose.disconnect()
      .then(() => {
        console.log('Server closed. Database instance disconnected.');
        process.exit(0);
      })
      .catch((err) => {
        console.error('Error disconnecting from database:', err);
        process.exit(1);
      });
  });
});
