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