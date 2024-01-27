describe('1. User Registration', () => {
  before(() => {
     cy.exec('node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so');
     cy.exec('node ../server/init.js mongodb://127.0.0.1:27017/fake_so');
     });

  after(() => {
        cy.exec('node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so')
       });

  beforeEach(() => {
    cy.visit('http://localhost:3000/');
  });

  it('1.1 | Register Page allows a user to register and redirects to the Login page', () => {
  cy.contains('Register').click();
    const userData = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'testpassword',
      repeatPassword: 'testpassword'
    };

    // Fill in registration form
    cy.get('input[name="username"]').type(userData.username);
    cy.get('input[name="email"]').type(userData.email);
    cy.get('input[name="password"]').type(userData.password);
    cy.get('input[name="repeatPassword"]').type(userData.repeatPassword);

    // Submit the form
    cy.get('form').submit();

    // Ensure redirection to the Login page after successful registration
    cy.url().should('include', '/login');
  });

  it('1.2 | displays an error message when passwords do not match during registration', () => {
    cy.contains('Register').click();
    const userData = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'testpassword',
      repeatPassword: 'mismatchedpassword'
    };

    // Fill in registration form with mismatched passwords
    cy.get('input[name="username"]').type(userData.username);
    cy.get('input[name="email"]').type(userData.email);
    cy.get('input[name="password"]').type(userData.password);
    cy.get('input[name="repeatPassword"]').type(userData.repeatPassword);

    // Submit the form
    cy.get('form').submit();

    // Ensure an error message is displayed for mismatched passwords
    cy.get('.register-container').contains('Passwords do not match').should('be.visible');
  });

  it('1.3 | displays an error message for invalid email format during registration', () => {
      cy.contains('Register').click();
      const userData = {
        username: 'testuser',
        email: 'invalidemailformat', // Invalid email format without @ symbol
        password: 'testpassword',
        repeatPassword: 'testpassword'
      };

      // Fill in registration form with invalid email format
      cy.get('input[name="username"]').type(userData.username);
      cy.get('input[name="email"]').type(userData.email);
      cy.get('input[name="password"]').type(userData.password);
      cy.get('input[name="repeatPassword"]').type(userData.repeatPassword);

      // Submit the form
      cy.get('form').submit();

      // Ensure an error message is displayed for invalid email format
      cy.get('.register-container').contains('Please provide a valid email address').should('be.visible');
    });
});

describe('2. Login Functionality', () => {
  before(() => {
   // Seed the database before each test
   cy.exec('node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so');
   cy.exec('node ../server/init.js mongodb://127.0.0.1:27017/fake_so');
   });

  after(() => {
     // Clear the database after each test
      cy.exec('node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so')
     });
  beforeEach(() => {
      cy.visit('http://localhost:3000/');
    });

  it('2.1 | should successfully log in with valid credentials', () => {
    cy.contains('Login').click();
    // Fill in the login form with valid credentials and submit
    cy.get('input[name="username"]').type('azad');
    cy.get('input[name="password"]').type('p2');
    cy.get('form').submit();

    // Ensure redirection to the home page after successful login
    cy.url().should('include', '/home');
  });

  it('2.2 | should display an error message for invalid credentials', () => {
    // Fill in the login form with invalid credentials and submit
    cy.contains('Login').click();
    cy.get('input[name="username"]').type('invalidUsername');
    cy.get('input[name="password"]').type('invalidPassword');
    cy.get('form').submit();

    // Ensure error message is displayed
    cy.get('.error-message').should('be.visible');
  });

  it('2.3 | should display an error message for invalid password for registered user', () => {
    // Fill in the login form with invalid credentials and submit
    cy.contains('Login').click();
    cy.get('input[name="username"]').type('hamkalo');
    cy.get('input[name="password"]').type('invalidPassword');
    cy.get('form').submit();

    // Ensure error message is displayed
    cy.get('.error-message').should('be.visible');
});

  it('2.4 | Successful login shows options to view user profile and logout options', () => {
    cy.contains('Login').click();
    // Fill in the login form with valid credentials and submit
    cy.get('input[name="username"]').type('azad');
    cy.get('input[name="password"]').type('p2');
    cy.get('form').submit();

    // Ensure redirection to the home page after successful login
    cy.url().should('include', '/home');

    // Ensure logout button is present (on-click behavior tested later)
    cy.get('.header-content').get("#logoutBtn");

    // Ensure User Profile button is present (on-click behavior tested later)
    cy.get('#sideBarNav').get("#userProfileButton")
  });
});

describe('3 Logout Functionality', () => {
  before(() => {
   // Seed the database before each test
   cy.exec('node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so');
   cy.exec('node ../server/init.js mongodb://127.0.0.1:27017/fake_so');
   });

  after(() => {
     // Clear the database after each test
      cy.exec('node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so')
     });
  beforeEach(() => {
      cy.visit('http://localhost:3000/');
    });

  it('3.1 | should successfully log in with valid credentials, then return to Welcome Page after logging out', () => {
    cy.contains('Login').click();
    // Fill in the login form with valid credentials and submit
    cy.get('input[name="username"]').type('azad');
    cy.get('input[name="password"]').type('p2');
    cy.get('form').submit();

    // Ensure redirection to the home page after successful login
    cy.url().should('include', '/home');
    cy.contains('Logout').click();
    cy.contains('Welcome to Fake Stack Overflow').should('be.visible');
  });

});

describe('4. Welcome Page UI', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
  });
  it('4.1 | Welcome Page displays options for new user registration, existing user login, and guest login', () => {

    // Ensure the welcome text is displayed
    cy.contains('h1', 'Welcome to Fake Stack Overflow!').should('be.visible');

    // Verify the presence of buttons for registration, login, and guest login
    cy.contains('button', 'Register').should('be.visible');
    cy.contains('button', 'Login').should('be.visible');
    cy.contains('button', 'Continue as a guest').should('be.visible');

    // Click the buttons and verify navigation
    cy.contains('button', 'Register').click();
    cy.url().should('include', '/register');

    cy.visit('http://localhost:3000/');

    cy.contains('button', 'Login').click();
    cy.url().should('include', '/login');

    cy.visit('http://localhost:3000/');

    cy.contains('button', 'Continue as a guest').click();
    cy.url().should('include', '/home');
  });
});

describe('5. Home Page Functionality - Guest', () => {

    beforeEach(() => {
        cy.exec('node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so')
        cy.exec('node ../server/init.js mongodb://127.0.0.1:27017/fake_so');
        cy.visit('http://localhost:3000/');
        cy.contains('Continue as a guest').click();
    });

    afterEach(() => {
        cy.exec('node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so')
    });

    it('5.1 | Should display options to view all questions, view all tags, and a search box', () => {
        cy.contains('Questions').should('be.visible');
        cy.contains('Tags').should('be.visible');
        cy.get('#searchBar').should('be.visible').should('have.attr', 'placeholder', 'Search...');
    });

    it('5.2 | Check if questions are displayed in descending order of dates by default', () => {
          const qTitles = ["What are the best practices for securing a Node.js REST API?","How to set up a CI/CD pipeline for a Node.js application on AWS?","How to handle user sessions in a PHP web application?"
          ,"How to use Redux for state management in a React Native app?","How to use machine learning for image classification?"];

          cy.visit('http://localhost:3000');
          cy.contains('Login').click();
          cy.get('input[name="username"]').type('azad');
          cy.get('input[name="password"]').type('p2');
          cy.get('form').submit();
          cy.get('.postTitle').each(($el, index, $list) => {
              cy.wrap($el).should('contain', qTitles[index]);
          })
    })

    it('5.3 | Successfully shows all questions in model in active order', () => {
          const qTitles = ["How to handle user sessions in a PHP web application?", "What are the best practices for securing a Node.js REST API?",
          "What are the differences between NoSQL and SQL databases?", "How to set up a CI/CD pipeline for a Node.js application on AWS?",
          "How to use Redux for state management in a React Native app?"];
          cy.visit('http://localhost:3000');
          cy.contains('Login').click();
          cy.get('input[name="username"]').type('azad');
          cy.get('input[name="password"]').type('p2');
          cy.get('form').submit();
          cy.contains('Active').click();
          cy.get('.postTitle').each(($el, index, $list) => {
              cy.wrap($el).should('contain', qTitles[index]);
          })
    })

    it('5.4 | Successfully shows all questions in model in newest order', () => {
          const qTitles = ["What are the best practices for securing a Node.js REST API?","How to set up a CI/CD pipeline for a Node.js application on AWS?","How to handle user sessions in a PHP web application?"
                ,"How to use Redux for state management in a React Native app?","How to use machine learning for image classification?"];

          cy.visit('http://localhost:3000');
          cy.contains('Login').click();
          cy.get('input[name="username"]').type('azad');
          cy.get('input[name="password"]').type('p2');
          cy.get('form').submit();
          cy.contains('Newest').click();
          cy.get('.postTitle').each(($el, index, $list) => {
              cy.wrap($el).should('contain', qTitles[index]);
          })
    })

    it('5.5 | Should display a truncated question summary if it exceeds 50 characters', () => {

        const longQuestion = "I'm developing a PHP web application and need to implement user sessions. What's the recommended approach for handling user sessions in a PHP application?";
        cy.visit('http://localhost:3000');
        cy.contains('Login').click();
        cy.get('input[name="username"]').type('azad');
        cy.get('input[name="password"]').type('p2');
        cy.get('form').submit();
        cy.get('.questionSummary').should('contain', `${longQuestion.substring(0, 50)}...`);
  });

    it('5.6 | Redirects to login page if clicked on ask a question form', () => {
        cy.contains('Ask a Question').click();
        cy.url().should('include', '/login');
    });

    it('5.7 | Check that Ask a Question button is not present', () => {
        cy.get('button').contains('Ask a question').should('not.exist');
    })

    it('5.8 | Check that logout button is not present', () => {
        cy.get('#logoutBtn').should('not.exist');
    })

    it('5.9 | Check that User Profile button is not present', () => {
        cy.get('#profileLink').should('not.exist');
    })
});

describe('6. Home Page Functionality - Registered User', () => {

    beforeEach(() => {
        cy.exec('node ../server/init.js mongodb://127.0.0.1:27017/fake_so');
        cy.visit('http://localhost:3000/');
        cy.contains('Login').click();
        cy.get('input[name="username"]').type('azad');
        cy.get('input[name="password"]').type('p2');
        cy.get('form').submit();
    });

    afterEach(() => {
        cy.exec('node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so')
    });

    it('6.1 | Should display options to view all questions, view all tags, and a search box', () => {
        cy.contains('Tags').should('be.visible');
        cy.get('#searchBar').should('be.visible').should('have.attr', 'placeholder', 'Search...');
    });

    it('6.2 | Check if questions are displayed in descending order of dates by default', () => {
        const qTitles = ["What are the best practices for securing a Node.js REST API?","How to set up a CI/CD pipeline for a Node.js application on AWS?","How to handle user sessions in a PHP web application?"
        ,"How to use Redux for state management in a React Native app?","How to use machine learning for image classification?"];

        cy.get('form').submit();
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        })
    })

    it('6.3 | Successfully shows all questions in model in active order', () => {
        const qTitles = ["How to handle user sessions in a PHP web application?", "What are the best practices for securing a Node.js REST API?",
        "What are the differences between NoSQL and SQL databases?", "How to set up a CI/CD pipeline for a Node.js application on AWS?",
        "How to use Redux for state management in a React Native app?"];
        cy.contains('Active').click();
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        })
    })

    it('6.4 | Successfully shows all questions in model in newest order', () => {
        const qTitles = ["What are the best practices for securing a Node.js REST API?","How to set up a CI/CD pipeline for a Node.js application on AWS?","How to handle user sessions in a PHP web application?"
              ,"How to use Redux for state management in a React Native app?","How to use machine learning for image classification?"];
        cy.contains('Newest').click();
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        })
    })

    it('6.5 | Should display a truncated question summary if it exceeds 50 characters', () => {

        const longQuestion = "I'm developing a PHP web application and need to implement user sessions. What's the recommended approach for handling user sessions in a PHP application?";
        cy.get('.questionSummary').should('contain', `${longQuestion.substring(0, 50)}...`);
    });

    it('6.6 | Check that logout button is present', () => {
        cy.get('#logoutBtn');
    })

    it('6.7 | Check that User Profile button is present', () => {
        cy.get('#profileLink');
    })
    
    it('6.8 | Registered User is able to post a new question', () => {
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question Q1');
        cy.get('#formTextInput').type('Test Question Q1 Text T1');
        cy.get('#formTagInput').type('javascript');
        cy.contains('Post Question').click();
        cy.contains('Fake Stack Overflow');
        cy.contains('21 questions');
        cy.contains('azad asked 0 seconds ago');
        const answers = ['0 answers','6 answers', '1 answers', '1 answers', '2 answers'];
        const views = ['0 views', '95 views', '72 views','75 views', '73 views'];
        const votes = ['0 votes', '47 votes', '51 votes','62 votes', '84 votes'];
        cy.get('.postStats').each(($el, index, $list) => {
            cy.wrap($el).should('contain', answers[index]);
            cy.wrap($el).should('contain', views[index]);
            cy.wrap($el).should('contain', votes[index]);
        });
    })
  });

describe('7. Search functionality ', () => {
   before(() => {
       cy.exec('node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so');
       cy.exec('node ../server/init.js mongodb://127.0.0.1:27017/fake_so');
   });

    after(() => {
        cy.exec('node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so')
    });

    beforeEach(() => {
      cy.visit('http://localhost:3000/');
    });

    it('7.1 | Search for a question using text content that does not exist', () => {
        cy.contains('Login').click();
        cy.get('input[name="username"]').type('azad');
        cy.get('input[name="password"]').type('p2');
        cy.get('form').submit();
        const searchText = "Web3";
        cy.get('#searchBar').type(`${searchText}{enter}`);
        cy.get('.postTitle').should('have.length', 0);
    })

    it('7.2 | Search a question by tag (t2)', () => {
        const qTitles = ['What are the best practices for securing a Node.js REST API?', "How to set up a CI/CD pipeline for a Node.js application on AWS?",
        "How to handle database migrations in a Python Django project?"];
        cy.visit('http://localhost:3000');
        cy.contains('Login').click();
        cy.get('input[name="username"]').type('azad');
        cy.get('input[name="password"]').type('p2');
        cy.get('form').submit();
        cy.get('#searchBar').type('[Java]{enter}');
        cy.get('.postTitle').each(($el, index, $list) => {
          cy.wrap($el).should('contain', qTitles[index]);
        })
    })

    it('7.3 | Search for a question using a tag that does not exist', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Login').click();
        cy.get('input[name="username"]').type('azad');
        cy.get('input[name="password"]').type('p2');
        cy.get('form').submit();
        cy.get('#searchBar').type('[nonExistentTag]{enter}');
        cy.get('.postTitle').should('have.length', 0);
    })

    it('7.4 | Search a question using a tag that does exist', () => {
        const qTitle = 'How to use machine learning for image classification?';

        cy.visit('http://localhost:3000');
        cy.contains('Login').click();
        cy.get('input[name="username"]').type('azad');
        cy.get('input[name="password"]').type('p2');
        cy.get('form').submit();
        cy.get('#searchBar').type('[algorithm]{enter}');
        cy.get('.postTitle').should('have.length', 1);
        cy.get('.postTitle').should('contain', qTitle);
    })

    it('7.5 | Should display only 5 questions and show pagination buttons when more questions exist', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Login').click();
        cy.get('input[name="username"]').type('azad');
        cy.get('input[name="password"]').type('p2');
        cy.get('form').submit();
        cy.get('#searchBar').type('[react]{enter}');
        cy.get('.paginationButtons').should('exist');
        cy.contains('Next').click();
        cy.get('.question').should('have.length', 3);
        cy.contains('Prev').click();
        cy.contains('Prev').should('be.disabled');
    });

});

describe('8. Tags Page', () => {
    beforeEach(() => {
    cy.exec('node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so')
        cy.exec('node ../server/init.js mongodb://127.0.0.1:27017/fake_so');
        cy.visit('http://localhost:3000/');
    });

    afterEach(() => {
        cy.exec('node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so')
    });

    it('8.1 | Checks if all tags exist', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Login').click();
       // Fill in the login form with valid credentials and submit
        cy.get('input[name="username"]').type('testUser');
        cy.get('input[name="password"]').type('p23');
        cy.get('form').submit();
        // all tags exist in the page
        cy.contains('Tags').click();
        cy.contains('react', {matchCase: false});
        cy.contains('javascript', {matchCase: false});
        cy.contains('android-studio', {matchCase: false});
        cy.contains('shared-preferences', {matchCase: false});
        cy.contains('storage', {matchCase: false});
        cy.contains('website', {matchCase: false});
        cy.contains('Flutter', {matchCase: false});
    })

    it('8.2 | Checks if all questions exist inside tags', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Login').click();
        // Fill in the login form with valid credentials and submit
        cy.get('input[name="username"]').type('testUser');
        cy.get('input[name="password"]').type('p23');
        cy.get('form').submit();
        // all question no. should be in the page
        cy.contains('Tags').click();
        cy.contains('20 Tags');
        cy.contains('1 question');
        cy.contains('0 question')
    })

    it('8.3 | Checks if all questions exist inside tags', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Login').click();
        // Fill in the login form with valid credentials and submit
        cy.get('input[name="username"]').type('testUser');
        cy.get('input[name="password"]').type('p23');
        cy.get('form').submit();
        // all question no. should be in the page
        cy.contains('Tags').click();
        cy.contains('20 Tags');
        cy.contains('react').click();
        cy.contains('8 questions')
        cy.contains('Title: Best practices for securing a RESTful API in Express.js?');
    })

    it('8.4 | Create new question through ask question and then find it in tags page', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Login').click();
        // Fill in the login form with valid credentials and submit
        cy.get('input[name="username"]').type('testUser');
        cy.get('input[name="password"]').type('p23');
        cy.get('form').submit();
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question A');
        cy.get('#formTextInput').type('Test Question A Text');
        cy.get('#formTagInput').type('test1-tag1');
        cy.contains('Post Question').click();

        // clicks tags
        cy.contains('Tags').click();
        cy.contains('test1-tag1').click();
        cy.contains('Test Question A')
    })

    it('8.5 | Questions associated with the tag name are in newest order', () => {
        const qTitles = ["What are the best practices for securing a Node.js REST API?", " How to set up a CI/CD pipeline for a Node.js application on AWS?",
        "How to structure a Flutter app for scalability"];
        cy.visit('http://localhost:3000');
        cy.contains('Login').click();
        // Fill in the login form with valid credentials and submit
        cy.get('input[name="username"]').type('testUser');
        cy.get('input[name="password"]').type('p23');
        cy.get('form').submit();
        // clicks tags
        cy.contains('Tags').click();
        cy.contains('Flutter').click();
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        })
    })

});

describe('9. Question Submission Functionality', () => {

    beforeEach(() => {
        cy.exec('node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so')
        cy.exec('node ../server/init.js mongodb://127.0.0.1:27017/fake_so');
    });

    afterEach(() => {
        cy.exec('node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so')
    });

    it('9.1 | Adds three questions and one answer, then click "Questions", then click unanswered button, verifies the sequence', () => {

        cy.visit('http://localhost:3000/');
        cy.contains('Login').click();
        cy.get('input[name="username"]').type('azad');
        cy.get('input[name="password"]').type('p2');
        cy.get('form').submit();
        cy.contains('Ask a Question').click();

        cy.get('#formTitleInput').type('Test Question A');
        cy.get('#formTextInput').type('Test Question A Text');
        cy.get('#formTagInput').type('javascript');
        cy.contains('Post Question').click();
      });

  

    it('9.2 | Ask a Question with empty title shows error', () => {
        cy.visit('http://localhost:3000/');
        cy.contains('Login').click();
        cy.get('input[name="username"]').type('azad');
        cy.get('input[name="password"]').type('p2');
        cy.get('form').submit();
        cy.contains('Ask a Question').click();

        cy.get('#formTextInput').type('Test Question 1 Text Q1');
        cy.get('#formTagInput').type('javascript');
        cy.contains('Post Question').click();
        cy.contains('Title must not be empty');
    })

    it('9.3 | Ask a Question with empty title shows error', () => {
        cy.visit('http://localhost:3000/');
        cy.contains('Login').click();
        cy.get('input[name="username"]').type('azad');
        cy.get('input[name="password"]').type('p2');
        cy.get('form').submit();
        cy.contains('Ask a Question').click();
      
        cy.get('#formTitleInput').type('Test Question 1');
        cy.get('#formTagInput').type('javascript');
        cy.contains('Post Question').click();
        cy.contains('Question text must not be empty.');
    })

    it('9.4 | Ask a Question with invalid tags shows error', () => {
        cy.visit('http://localhost:3000/');
        cy.contains('Login').click();
        cy.get('input[name="username"]').type('azad');
        cy.get('input[name="password"]').type('p2');
        cy.get('form').submit();
        cy.contains('Ask a Question').click();

        cy.get('#formTitleInput').type('Test Question 1');
        cy.get('#formTextInput').type('Sample Text');
        cy.get('#formTagInput').type('t1 t2 t3 t4 t5 t6');
        cy.contains('Post Question').click();
        cy.contains('Tags should be up to 5');
    })

    it('9.5 | Ask a Question with invalid tags shows error', () => {cy.visit('http://localhost:3000/');
        cy.contains('Login').click();
        cy.get('input[name="username"]').type('azad');
        cy.get('input[name="password"]').type('p2');
        cy.get('form').submit();
        cy.contains('Ask a Question').click();

        cy.get('#formTitleInput').type('Test Question 1');
        cy.get('#formTagInput').type('javascriptjavascriptjavascriptjavascriptjavascriptjavascript');
        cy.contains('Post Question').click();
        cy.contains('each tag should be within 20 characters.');
    })

    it('9.6 | Adds a question with a hyperlink and verifies', () => {
        cy.visit('http://localhost:3000/');
        cy.contains('Login').click();
        cy.get('input[name="username"]').type('azad');
        cy.get('input[name="password"]').type('p2');
        cy.get('form').submit();
        cy.contains('Ask a Question').click();

        cy.get('#formTitleInput').type('How to add a hyperlink in Markdown?');
        cy.get('#formTextInput').type('Here is a link: [Google](https://www.google.com)');
        cy.get('#formTagInput').type('markdown');
        cy.contains('Post Question').click();
        cy.contains('How to add a hyperlink in Markdown?').click();
        cy.get('#questionBody').find('a').should('have.attr', 'href', 'https://www.google.com');
      });

    it('9.7 | Adds a question with a invalid hyperlink and verifies', () => {
        cy.visit('http://localhost:3000/');
        cy.contains('Login').click();
        cy.get('input[name="username"]').type('azad');
        cy.get('input[name="password"]').type('p2');
        cy.get('form').submit();
        cy.contains('Ask a Question').click();

        cy.get('#formTitleInput').type('How to add a hyperlink in Markdown?');
        cy.get('#formTextInput').type('Here is a link: [Google](htt://www.google.com)');
        cy.get('#formTagInput').type('markdown');
        cy.contains('Post Question').click();
        cy.contains('Invalid hyperlink format. Hyperlinks must be in the format [text](URL) and start with "https://".');
        });

    it('9.8 | Verify user with reputation below 50 is not able to add new tags', () => {
        cy.visit('http://localhost:3000/');
        cy.contains('Login').click();
        cy.get('input[name="username"]').type('abaya');
        cy.get('input[name="password"]').type('p3');
        cy.get('form').submit();
        cy.contains('Ask a Question').click();

        cy.get('#formTitleInput').type('Test Question 1');
        cy.get('#formTextInput').type('Sample Text');
        cy.get('#formTagInput').type('t1');
        cy.contains('Post Question').click();
        cy.contains('Error');
    });

    it('9.9 | Should display only 5 questions and show pagination buttons when more questions exist', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Login').click();
        cy.get('input[name="username"]').type('azad');
        cy.get('input[name="password"]').type('p2');
        cy.get('form').submit();
        cy.contains('20 questions');

        // Check if pagination buttons are displayed
        cy.get('.paginationButtons').should('exist');

        // Click on the 'Next' button
        cy.contains('Next').click();

        // Verify the next set of questions is displayed
        cy.get('.question').should('have.length', 5);

        // Click on the 'Prev' button
        cy.contains('Prev').click();

        // Verify the previous set of questions is displayed
        cy.get('.question').should('have.length', 5);

        // Try clicking 'Prev' button again when on the first set of questions, should remain on the same set
        cy.contains('Prev').should('be.disabled');  
    });
});

describe('10. Corner case for pagination ', () => {
    before(() => {
        cy.exec('node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so');
        cy.exec('node ../server/initInvalid.js mongodb://127.0.0.1:27017/fake_so');
    });

    after(() => {
        cy.exec('node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so')
    });

    beforeEach(() => {
        cy.visit('http://localhost:3000/');
    });

    it('10.1 | Should not display Next or Prev buttons when fewer than 5 questions exist', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Login').click();
        cy.get('input[name="username"]').type('azad');
        cy.get('input[name="password"]').type('p2');
        cy.get('form').submit();
        cy.contains('4 questions');
        cy.contains('Next').should('not.exist');
        cy.contains('Prev').should('not.exist');
    });
});

describe('11. View Single Question - Guest', () => {
    beforeEach(() => {
        cy.exec('node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so')
        cy.exec('node ../server/init.js mongodb://127.0.0.1:27017/fake_so');
        cy.visit('http://localhost:3000/');
        cy.contains('Continue as a guest').click();
        cy.contains('What are the best practices for securing a Node.js REST API?').click();
    });

    afterEach(() => {
        cy.exec('node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so')
    });

    it('11.1 | Check that question data is present in expected format', () => {
        cy.get('.voteContainer').contains('47 votes');
        cy.get('#answerCount').contains('6 answers');
        cy.get('#questionTitle').contains('What are the best practices for securing a Node.js REST API');
        cy.get('#views').contains('96 views');
        cy.get('#questionText').contains('I\'m building a Node.js REST API, and I want to ensure it\'s secure against common vulnerabilities. What are the recommended best practices for securing a Node.js API?');
        cy.get('.lastActivity').contains('abhi3241 asked Jun 10, 2023 at 15:30');
    });

    it('11.2 | Check that a question\'s comments are present', () => {
        cy.get('#qComments').contains('Security is paramount for any API. Make sure to use HTTPS, input validation, and proper authentication methods.');
    });

    it('11.3 | Check that a question\'s answers are present', () => {
        const answerText = ['I just found all the above examples just too confusing, so I wrote my own.','Using Amazon S3 for scalable storage of binary content.', 'Using MongoDB to store binary data as GridFS chunks is a scalable solution for handling large files.', 'Storing data in a SQLite database is a common choice for mobile app development', 'Using GridFS to chunk and store content is a reliable method for handling large files.'];
        const authors = ['sana answered Nov 01, 2023 at 15:30', 'testUser answered Apr 20, 2023 at 16:45', 'saltyPeter answered Apr 10, 2023 at 14:45','Joji John answered Mar 22, 2023 at 21:30', 'ihba001 answered Feb 22, 2023 at 17:45'];
        const votes = ['0 votes', '0 votes', '0 votes','0 votes', '0 votes'];
        cy.get('#ansList').each(($el, index, $list) => {
            cy.wrap($el).should('contain', answerText[index]);
            cy.wrap($el).should('contain', authors[index]);
            cy.wrap($el).should('contain', votes[index]);
        });
    });
    
    it('11.4 | Check that an answer\' comments are present', () => {
       cy.get('#aComments').contains('I agree, sometimes the examples can be confusing. Writing your own code can be a good learning experience!');
    });

    it('11.5 | Check that Answer Question button is not present', () => {
        cy.get('#ans#QuestionButton').should('not.exist');
    })

    it('11.6 | Check that a question cannot be voted', () => {
        cy.get('#questionInfo').then(() => {
            cy.get('.voteContainer').then(() => {
                cy.get('#increaseVoteCount').should('not.exist');
                cy.get('#decreaseVoteCount').should('not.exist');
            });
        })
    });

    it('11.7 | Check that an answer cannot be voted', () => {
        cy.get('#answer').then(() => {
            cy.get('.voteContainer').then(() => {
                cy.get('#increaseVoteCount').should('not.exist');
                cy.get('#decreaseVoteCount').should('not.exist');
            });
        })
    })

    it('11.8 | Check that a comment cannot be voted', () => {
        cy.get('#commentDiv').then(() => {
            cy.get('.voteContainer').then(() => {
                cy.get('#increaseVoteCount').should('not.exist');
            });
        })
    })

    it('11.9 | Check that Comment Submission box is not present for questions and answers', () => {
        cy.get('#qComments').then(() => {
            cy.get('.newCommentContainer').should('not.exist');
        });

        cy.get('#answerContainer').then(() => {
            cy.get('#aComments').then(() => {
                cy.get('.newCommentContainer').should('not.exist');
            })
        });
    })

    it('11.10 | Should render only five answers at a time', () => {
        // Five Answers + Pagination Button Div
        cy.get('#ansList').children().should('have.length', 6);
    });
});

describe('12. View Single Question - User', () => {
    beforeEach(() => {
        cy.exec('node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so')
        cy.exec('node ../server/init.js mongodb://127.0.0.1:27017/fake_so');
        cy.visit('http://localhost:3000/');
    });

    afterEach(() => {
        cy.exec('node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so')
    });
    

    it('12.1 | Check that question data is present in expected format', () => {
        cy.contains('Login').click();
        cy.get('input[name="username"]').type('abhi3241');
        cy.get('input[name="password"]').type('p6');
        cy.get('form').submit();
        cy.contains('What are the best practices for securing a Node.js REST API?').click();
        
        cy.get('.voteContainer').contains('47 votes');
        cy.get('#answerCount').contains('6 answers');
        cy.get('#questionTitle').contains('What are the best practices for securing a Node.js REST API');
        cy.get('#views').contains('96 views');
        cy.get('#questionText').contains('I\'m building a Node.js REST API, and I want to ensure it\'s secure against common vulnerabilities. What are the recommended best practices for securing a Node.js API?');
        cy.get('.lastActivity').contains('abhi3241 asked Jun 10, 2023 at 15:30');
    });

    it('12.2 | Check that a question\'s comments are present', () => {
        cy.contains('Login').click();
        cy.get('input[name="username"]').type('abhi3241');
        cy.get('input[name="password"]').type('p6');
        cy.get('form').submit();
        cy.contains('What are the best practices for securing a Node.js REST API?').click();
        
        cy.get('#qComments').contains('Security is paramount for any API. Make sure to use HTTPS, input validation, and proper authentication methods.');
    });

    it('12.3 | Check that a question\'s answers are present', () => {
        cy.contains('Login').click();
        cy.get('input[name="username"]').type('abhi3241');
        cy.get('input[name="password"]').type('p6');
        cy.get('form').submit();
        cy.contains('What are the best practices for securing a Node.js REST API?').click();
        
        const answerText = ['I just found all the above examples just too confusing, so I wrote my own.','Using Amazon S3 for scalable storage of binary content.', 'Using MongoDB to store binary data as GridFS chunks is a scalable solution for handling large files.', 'Storing data in a SQLite database is a common choice for mobile app development', 'Using GridFS to chunk and store content is a reliable method for handling large files.'];
        const authors = ['sana answered Nov 01, 2023 at 15:30', 'testUser answered Apr 20, 2023 at 16:45', 'saltyPeter answered Apr 10, 2023 at 14:45','Joji John answered Mar 22, 2023 at 21:30', 'ihba001 answered Feb 22, 2023 at 17:45'];
        const votes = ['0 votes', '0 votes', '0 votes','0 votes', '0 votes'];
        cy.get('#ansList').each(($el, index, $list) => {
            cy.wrap($el).should('contain', answerText[index]);
            cy.wrap($el).should('contain', authors[index]);
            cy.wrap($el).should('contain', votes[index]);
        });
    });

    it('12.4 | Check that an answer\' comments are present', () => {
        cy.contains('Login').click();
        cy.get('input[name="username"]').type('abhi3241');
        cy.get('input[name="password"]').type('p6');
        cy.get('form').submit();
        cy.contains('What are the best practices for securing a Node.js REST API?').click();
        
        cy.get('#aComments').contains('I agree, sometimes the examples can be confusing. Writing your own code can be a good learning experience!');
    });

    it('12.5 | Check that Answer Question button is present', () => {
        cy.contains('Login').click();
        cy.get('input[name="username"]').type('abhi3241');
        cy.get('input[name="password"]').type('p6');
        cy.get('form').submit();
        cy.contains('What are the best practices for securing a Node.js REST API?').click();
        
        cy.get('#ansQuestion').contains("Answer Question")
    })

    it('12.6 | Check that a question can be voted', () => {
        cy.contains('Login').click();
        cy.get('input[name="username"]').type('abhi3241');
        cy.get('input[name="password"]').type('p6');
        cy.get('form').submit();
        cy.contains('What are the best practices for securing a Node.js REST API?').click();
        
        cy.get('#questionInfo').get('.voteContainer').contains('Upvote').click();
        cy.get('#questionInfo').get('.voteContainer').contains('48');
    })

    it('12.7 | Check that an answer can be voted', () => {
        cy.contains('Login').click();
        cy.get('input[name="username"]').type('abhi3241');
        cy.get('input[name="password"]').type('p6');
        cy.get('form').submit();
        cy.contains('What are the best practices for securing a Node.js REST API?').click();
        
        cy.get('#answer').then(() => {
            cy.get('.voteContainer').contains('Upvote').click();
        })
    })

    it('12.7 | Check that a comment can be voted', () => {
        cy.contains('Login').click();
        cy.get('input[name="username"]').type('abhi3241');
        cy.get('input[name="password"]').type('p6');
        cy.get('form').submit();
        cy.contains('What are the best practices for securing a Node.js REST API?').click();
        
        cy.get('#commentDiv').then(() => {
            cy.get('.voteContainer').contains('Upvote').click();
        })
    })

    it('12.8 | Check that user can accept an answer on a question that is theirs', () => {
        cy.contains('Login').click();
        cy.get('input[name="username"]').type('abhi3241');
        cy.get('input[name="password"]').type('p6');
        cy.get('form').submit();
        cy.contains('What are the best practices for securing a Node.js REST API?').click();
        
        cy.get('#answer').then(() => {
            cy.get('button').contains('Accept');
        })
    })

    it('12.9 | Check that user cannot accept an answer on a question that isn\'t theirs', () => {
        cy.contains('Login').click();
        cy.get('input[name="username"]').type('testUser');
        cy.get('input[name="password"]').type('p23');
        cy.get('form').submit();
        cy.contains('What are the best practices for securing a Node.js REST API?').click();
        
        cy.get('#answer').then(() => {
            cy.get('button').contains('Accept').should('not.exist');
        })
    })

    it('12.10 | Check that Comment Submission box is present for questions and answers', () => {
        cy.contains('Login').click();
        cy.get('input[name="username"]').type('abhi3241');
        cy.get('input[name="password"]').type('p6');
        cy.get('form').submit();
        cy.contains('What are the best practices for securing a Node.js REST API?').click();
        
        cy.get('#qComments').then(() => {
            cy.get('.newCommentContainer');
        });

        cy.get('#answerContainer').then(() => {
            cy.get('#aComments').then(() => {
                cy.get('.newCommentContainer');
            })
        });
    })

    it('12.11 | Check that Comment is correctly created and render upon submission', () => {
        cy.contains('Login').click();
        cy.get('input[name="username"]').type('abhi3241');
        cy.get('input[name="password"]').type('p6');
        cy.get('form').submit();
        cy.contains('How to set up a CI/CD pipeline for a Node.js application on AWS?').click();
        
        const comments = ['This is a test question comment{enter}', 'This is a test answer comment{enter}']

        cy.get('.newCommentContainer').get('textarea').each(($el, index, $list) => {
            cy.wrap($el).type(comments[index]);
        })

        cy.contains('This is a test question comment');
        cy.contains('This is a test answer comment');
    })

    // Five Answers + Pagination Button Div
    it('12.12 | Should render only five answers at a time', () => {
        cy.contains('Login').click();
        cy.get('input[name="username"]').type('abhi3241');
        cy.get('input[name="password"]').type('p6');
        cy.get('form').submit();
        cy.contains('What are the best practices for securing a Node.js REST API?').click();

        // Five Answers + Pagination Buttons Div
        cy.get('#ansList').children().should('have.length', 6);
    });
});

describe('13. Submit New Answer', () => {
    beforeEach(() => {
        cy.exec('node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so')
        cy.exec('node ../server/init.js mongodb://127.0.0.1:27017/fake_so');
        cy.visit('http://localhost:3000/');
        cy.contains('Login').click();
        cy.get('input[name="username"]').type('azad');
        cy.get('input[name="password"]').type('p2');
        cy.get('form').submit();
    });

    afterEach(() => {
        cy.exec('node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so')
    });


    it('13.1 | Adds an answer and is returned to questions page with answer displayed', () => {
        cy.contains('How to use machine learning for image classification?').click();
        cy.get('#ansList').children().should('have.length', 0);

        cy.contains('Answer Question').click();
        cy.get('#answerTextInput').type('Sample Answer');
        cy.get('button:contains("Post Answer")').click();

        cy.get('#ansList').children().should('have.length', 1);
        cy.contains('Sample Answer');
    });

    it('13.2 | Error message is displayed when no text is input', () => {
        cy.contains('How to use machine learning for image classification?').click();
        cy.get('#ansList').children().should('have.length', 0);

        cy.contains('Answer Question').click();
        cy.get('button:contains("Post Answer")').click();

        cy.contains('Answer text cannot be empty.');
    });

    it('13.3 | Error message is displayed when an invalid hyperlink is included', () => {
        cy.contains('How to use machine learning for image classification?').click();
        cy.get('#ansList').children().should('have.length', 0);

        cy.contains('Answer Question').click();
        cy.get('#answerTextInput').type('Here is a link: [Google](htt://www.google.com)');
        cy.get('button:contains("Post Answer")').click();

        cy.contains('Invalid hyperlink');
    });

    it('13.4 | Posts an answer containing a valid hyperlink', () => {
        cy.contains('How to use machine learning for image classification?').click();
        cy.get('#ansList').children().should('have.length', 0);

        cy.contains('Answer Question').click();
    
        cy.get('#answerTextInput').type('Here is a link: [Google](https://www.google.com)');
        cy.get('button:contains("Post Answer")').click();

        cy.get('#ansList').children().should('have.length', 1);
        cy.get('#answerContainer').find('a').should('have.attr', 'href', 'https://www.google.com');
    });
});

describe('14. User Profile UI', () => {
    beforeEach(() => {
        cy.exec('node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so')
        cy.exec('node ../server/init.js mongodb://127.0.0.1:27017/fake_so');
        cy.visit('http://localhost:3000/');
        cy.contains('Login').click();
        // Fill in the login form with valid credentials and submit
        cy.get('input[name="username"]').type('testUser');
        cy.get('input[name="password"]').type('p23');
        cy.get('form').submit();
    });

    afterEach(() => {
        cy.exec('node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so')
    });

    it('14.1 | User Profile contains user statistics and displays options to render questions, tags, and answers', () => {
        cy.contains('User Profile').click();

        cy.get('#userProfileHeader').contains('testUser\'s Profile');
        cy.get('#userStats').contains('Number of active days:');
        cy.get('#userStats').contains('Reputation: 200');
        cy.get('#userProfileMenu').contains('View My Questions');
        cy.get('#userProfileMenu').contains('View My Answers');
        cy.get('#userProfileMenu').contains('View My Tags');

    });

    it('14.2 | View My Questions button displays a user\'s questions', () => {
        cy.contains('User Profile').click();
        cy.get('#userProfileMenu').contains('View My Questions').click();

        cy.get('h2').contains("My Questions");
        cy.contains('How to implement user authentication in a Node.js app using Passport.js?');
        cy.contains('How to optimize SQL queries for better performance?');
        cy.contains('How to implement JWT authentication in a Python Flask app?');
        cy.contains('How to use machine learning for image classification?');
    });

    it('14.3 | View My Answers button displays a user\'s answers', () => {
        cy.contains('User Profile').click();
        cy.get('#userProfileMenu').contains('View My Answers').click();

        cy.get('h2').contains("My Answers");
        cy.contains('Using MongoDB to store binary data as GridFS chunks');
        cy.contains('Storing images as base64 encoded strings in JSON fields');
        cy.contains('Using Amazon S3 for scalable storage of binary content');
    });

    it('14.4 | View My Tags button displays a user\'s tags', () => {
        cy.contains('User Profile').click();
        cy.get('#userProfileMenu').contains('View My Tags').click();

        cy.get('h2').contains("My Tags");
        cy.contains('Flutter');
        cy.contains('Python');
        cy.contains('Java');
        cy.contains('C++');
        cy.contains('UI-design');
        cy.contains('data-analysis');
        cy.contains('machine-learning');
        cy.contains('algorithm');
    });
});

describe('15. User Profile - Edit/Delete Question', () => {
    beforeEach(() => {
        cy.exec('node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so')
        cy.exec('node ../server/init.js mongodb://127.0.0.1:27017/fake_so');
        cy.visit('http://localhost:3000/');
        cy.contains('Login').click();
        // Fill in the login form with valid credentials and submit
        cy.get('input[name="username"]').type('testUser');
        cy.get('input[name="password"]').type('p23');
        cy.get('form').submit();
        cy.contains('User Profile').click();
        cy.get('#userProfileMenu').contains('View My Questions').click();
    });

    afterEach(() => {
        cy.exec('node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so')
    });
    it('15.1 | Edit a question', () => {
        cy.contains('How to use machine learning for image classification?').click();
        cy.get('#formTitleInput').type('Updated question');
        cy.contains('Update Question').click();
        cy.contains('Updated question');
    });
    
    it('15.2 | Edit a question does not change the question post date', () => {
        cy.contains('How to use machine learning for image classification?').click();
        cy.get('#formTitleInput').type('new');
        cy.contains('Update Question').click();
        cy.contains('How to use machine learning for image classification?new');
        cy.contains('Questions').click();
        const searchText = "classification";
        cy.get('#searchBar').type(`${searchText}{enter}`);
        cy.contains('May 10, 2023');
    });

    it('15.3 | Edit with too long of title shows error', () => {
        cy.contains('How to use machine learning for image classification?').click();
        cy.get('#formTitleInput').clear();
        cy.get('#formTitleInput').type('c1gUpYvMQiFak1Hr7Kec4WcC3aNrZKI6hfcVeaCUgjFYDCh1vsOHUISdRmKr8Egc8DtGvk6r9565QfTm4nYRo4zzu4gnHWukWprTg');
        cy.contains('Update Question').click();
        cy.get('.error').contains('Title cannot be more than 100 characters');
    });

    it('15.4 | Edit with missing text shows error', () => {
        cy.contains('How to use machine learning for image classification?').click();
        cy.get('#formTextInput').clear();
        cy.contains('Update Question').click();
        cy.get('.error').contains('Question text cannot be empty');
    });

    it('15.5 | Edit with invalid tags shows error', () => {
        cy.contains('How to use machine learning for image classification?').click();
        cy.get('#formTagInput').type('t1 t2 t3 t4 t5 t6');
        cy.contains('Update Question').click();
        cy.get('.error').contains('Cannot have more than 5 tags');
    });

    it('15.6 | Delete a question', () => {
        cy.contains('How to use machine learning for image classification?').click();
        cy.contains('Delete Question').click();
        cy.get('#userProfileQstnList').should('not.contain', 'How to use machine learning for image classification?');
        cy.contains('Questions').click();
        const searchText = "classification";
        cy.get('#searchBar').type(`${searchText}{enter}`);
        cy.contains('No Questions Found');
    });
})

describe('16. User Profile - Edit/Delete Answer', () => {
    beforeEach(() => {
        cy.exec('node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so')
        cy.exec('node ../server/init.js mongodb://127.0.0.1:27017/fake_so');
        cy.visit('http://localhost:3000/');
        cy.contains('Login').click();
        // Fill in the login form with valid credentials and submit
        cy.get('input[name="username"]').type('testUser');
        cy.get('input[name="password"]').type('p23');
        cy.get('form').submit();
        cy.contains('User Profile').click();
        cy.get('#userProfileMenu').contains('View My Answers').click();
    });

    afterEach(() => {
        cy.exec('node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so')
    });
    it('16.1 | Edit an answer', () => {
        cy.contains('Using Amazon S3 for scalable storage of binary content.').click();
        cy.get('#answerTextInput').type('new');
        cy.contains('Update Answer').click();
        cy.contains('Using Amazon S3 for scalable storage of binary content.new');
    });

    it('16.2 | Delete an answer', () => {
        cy.contains('Using Amazon S3 for scalable storage of binary content.').click();
        cy.contains('Delete Answer').click();
        cy.get('#userProfileAnsList').should('not.contain', 'Using Amazon S3 for scalable storage of binary content.');

    });
})

describe('17. User Profile - Edit/Delete Tag', () => {
    beforeEach(() => {
        cy.exec('node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so')
        cy.exec('node ../server/init.js mongodb://127.0.0.1:27017/fake_so');
        cy.visit('http://localhost:3000/');
        cy.contains('Login').click();
        // Fill in the login form with valid credentials and submit
        cy.get('input[name="username"]').type('testUser');
        cy.get('input[name="password"]').type('p23');
        cy.get('form').submit();
        cy.contains('User Profile').click();
        cy.get('#userProfileMenu').contains('View My Tags').click();
    });

    afterEach(() => {
        cy.exec('node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so')
    });

    it('17.1 | Edit a Tag', () => {
        cy.contains('Python').click();
        cy.get('#tagNameInput').type(' new');
        cy.contains('Update Tag').click();
        cy.contains('Python new');
    });

    it('17.2 | Delete is not possible if it is used by other questions', () => {
        cy.contains('Python').click();
        cy.contains('Delete Tag').click();
        cy.contains('Error deleting tag: This tag is being used by other users, so it cannot be deleted.');
    });

   it('17.3 | Delete is possible if it is not used by other questions', () => {
         cy.contains('algorithm').click();
         cy.contains('Delete Tag').click();
         cy.get('#userProfileTagList').should('not.contain', 'algorithm');
     });

   it('17.4 | Deleted tag not present in tags page', () => {
        cy.contains('algorithm').click();
        cy.contains('Delete Tag').click();
        cy.get('#tagsButton').click();
        cy.get('#tagGroups').should('not.contain', 'algorithm');

    });

})
