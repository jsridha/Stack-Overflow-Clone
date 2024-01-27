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