// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import './stylesheets/index.css';
import { AuthProvider } from './components/AuthContext.js';
import WelcomePage from './components/welcomepage.js';
import LoginPage from './components/loginpage.js';
import RegisterPage from './components/registerpage.js';
import FakeStackOverFlow from './components/fakestackoverflow.js';
import UserProfile from './components/userprofile/userprofile.js';
import QuestionForm from './components/questionform.js';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
 return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/home" element={<FakeStackOverFlow />} />
          <Route path="/" element={<WelcomePage />} />
          {/* Add a default route for other unmatched paths */}
          <Route render={() => <WelcomePage />} />
          {/* Route for UserProfile */}
          <Route path="/userprofile/*" element={<UserProfile />} />
          {/* Route for QuestionForm */}
          <Route path="/userprofile/questionForm/:questionId" element={<QuestionForm />} />
        </Routes>
      </Router>
    </AuthProvider>
 );
}

export default App;


