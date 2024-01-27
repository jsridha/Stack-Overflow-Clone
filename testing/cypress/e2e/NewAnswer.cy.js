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
