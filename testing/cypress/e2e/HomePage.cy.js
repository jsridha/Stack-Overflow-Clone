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