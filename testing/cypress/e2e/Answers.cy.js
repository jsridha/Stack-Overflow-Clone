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