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

    it('9.5 | Ask a Question with invalid tags shows error', () => {
        cy.visit('http://localhost:3000/');
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