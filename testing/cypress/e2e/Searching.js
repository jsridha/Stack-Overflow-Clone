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