// This is the update version of the cypress test

// 9 sections. 31 tests total

describe('Cypress Tests repeated from React assignment', () => {

    before(() => {
        // Seed the database before each test
        cy.exec('node ../server/init.js mongodb://127.0.0.1:27017/fake_so');
    });

    after(() => {
        // Clear the database after each test
        cy.exec('node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so')
    });


    it('1.1 | Adds three questions and one answer, then click "Questions", then click unanswered button, verifies the sequence', () => {
        cy.visit('http://localhost:3000');
        
        // add a question
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question A');
        cy.get('#formTextInput').type('Test Question A Text');
        cy.get('#formTagInput').type('javascript');
        cy.get('#formUsernameInput').type('mks1');
        cy.contains('Post Question').click();

        // add another question
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question B');
        cy.get('#formTextInput').type('Test Question B Text');
        cy.get('#formTagInput').type('javascript');
        cy.get('#formUsernameInput').type('mks2');
        cy.contains('Post Question').click();

        // add another question
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question C');
        cy.get('#formTextInput').type('Test Question C Text');
        cy.get('#formTagInput').type('javascript');
        cy.get('#formUsernameInput').type('mks3');
        cy.contains('Post Question').click();

        // add an answer to question A
        cy.contains('Test Question A').click();
        cy.contains('Answer Question').click();
        cy.get('#answerUsernameInput').type('abc3');
        cy.get('#answerTextInput').type('Answer Question A');
        cy.contains('Post Answer').click();

        // go back to main page
        cy.contains('Questions').click();

        // clicks unanswered
        cy.contains('Unanswered').click();
        const qTitles = ['Test Question C', 'Test Question B']
        cy.get('.postTitle').each(($el, index, $list) => {
        cy.wrap($el).should('contain', qTitles[index]);
        })
    })

    it('1.2 | Check if questions are displayed in descending order of dates.', () => {
        const qTitles = ['Quick question about storage on android','Object storage for a web application','android studio save string shared preference, start activity and load the saved string', 'Programmatically navigate using React router'];
        
        cy.visit('http://localhost:3000');
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        })
    })

    it('1.3 | successfully shows all questions in model in active order', () => {
        const qTitles = ['Programmatically navigate using React router','android studio save string shared preference, start activity and load the saved string', 'Quick question about storage on android', 'Object storage for a web application'];
        cy.visit('http://localhost:3000');
        cy.contains('Active').click();
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        })
    })

    it('2.1 | Adds multiple questions one by one and displays them in All Questions', () => {
        cy.visit('http://localhost:3000');

        // Add multiple questions
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question 1');
        cy.get('#formTextInput').type('Test Question 1 Text');
        cy.get('#formTagInput').type('javascript');
        cy.get('#formUsernameInput').type('joym');
        cy.contains('Post Question').click();

        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question 2');
        cy.get('#formTextInput').type('Test Question 2 Text');
        cy.get('#formTagInput').type('react');
        cy.get('#formUsernameInput').type('abhi');
        cy.contains('Post Question').click();


        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question 3');
        cy.get('#formTextInput').type('Test Question 3 Text');
        cy.get('#formTagInput').type('java');
        cy.get('#formUsernameInput').type('abhi');
        cy.contains('Post Question').click();

        // verify the presence of multiple questions in most recently added order.
        cy.contains('Fake Stack Overflow');
        const qTitles = ['Test Question 3', 'Test Question 2', 'Test Question 1','Quick question about storage on android','Object storage for a web application','android studio save string shared preference, start activity and load the saved string', 'Programmatically navigate using React router'];
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        });
        
        // verify that when clicking "Unanswered", the unanswered questions are shown
        cy.contains('Unanswered').click();
        const qTitlesUnanswered = ['Test Question 3', 'Test Question 2', 'Test Question 1']
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitlesUnanswered[index]);
        })

    });

    it('2.2 | Ask a Question creates and displays expected meta data', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question Q1');
        cy.get('#formTextInput').type('Test Question Q1 Text T1');
        cy.get('#formTagInput').type('javascript');
        cy.get('#formUsernameInput').type('new user 32');
        cy.contains('Post Question').click();
        cy.contains('Fake Stack Overflow');
        cy.contains('5 questions');
        cy.contains('new user 32 asked 0 seconds ago');
        const answers = ['0 answers', '1 answers','2 answers', '3 answers', '2 answers'];
        const views = ['0 views', '103 views', '200 views', '121 views','10 views'];
        cy.get('.postStats').each(($el, index, $list) => {
            cy.wrap($el).should('contain', answers[index]);
            cy.wrap($el).should('contain', views[index]);
        });
        cy.contains('Unanswered').click();
        cy.get('.postTitle').should('have.length', 1);
        cy.contains('1 question');
    })

    it('2.3 | Ask a Question with empty title shows error', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Ask a Question').click();
        cy.get('#formTextInput').type('Test Question 1 Text Q1');
        cy.get('#formTagInput').type('javascript');
        cy.get('#formUsernameInput').type('new user 32');
        cy.contains('Post Question').click();
        cy.contains('Title cannot be empty');
    })

    it('3.1 | Search for a question using text content that does not exist', () => {
        const searchText = "Web3";
        
        cy.visit('http://localhost:3000');
        cy.get('#searchBar').type(`${searchText}{enter}`);
        cy.get('.postTitle').should('have.length', 0);
    })

    it('3.2 | Search string in question text', () => {
        const qTitles = ['Object storage for a web application'];
        cy.visit('http://localhost:3000');
        cy.get('#searchBar').type('40 million{enter}');
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        })
    })

    it('3.3 | Search string in question text', () => {
        const qTitles = ['Quick question about storage on android'];
        cy.visit('http://localhost:3000');
        cy.get('#searchBar').type('data remains{enter}');
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        })
    })

    it('4.1 | Search a question by tag (t1)', () => {
        const qTitles = ["Programmatically navigate using React router"];
        cy.visit('http://localhost:3000');
        cy.get('#searchBar').type('[react]{enter}');
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        })
    })

    it('4.2 | Search a question by tag (t2)', () => {
        const qTitles = ['android studio save string shared preference, start activity and load the saved string', "Programmatically navigate using React router"];
        cy.visit('http://localhost:3000');
        cy.get('#searchBar').type('[javascript]{enter}');
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        })
    })

    it('4.3 | Search a question by tag (t3)', () => {
        const qTitles = ['Quick question about storage on android','android studio save string shared preference, start activity and load the saved string'];
        cy.visit('http://localhost:3000');
        cy.get('#searchBar').type('[android-studio]{enter}');
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        })
    })

    it('4.4 | Search a question by tag (t4)', () => {
        const qTitles = ['Quick question about storage on android',"android studio save string shared preference, start activity and load the saved string"];
        cy.visit('http://localhost:3000');
        cy.get('#searchBar').type('[shared-preferences]{enter}');
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        })
    })

    it('4.5 | Search for a question using a tag that does not exist', () => {
        cy.visit('http://localhost:3000');
        cy.get('#searchBar').type('[nonExistentTag]{enter}');
        cy.get('.postTitle').should('have.length', 0);
    })

    it('5.1 | Created new answer should be displayed at the top of the answers page', () => {
        const answers = ["Test Answer 1", "React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.", "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router."];
        cy.visit('http://localhost:3000');
        cy.contains('Programmatically navigate using React router').click();
        cy.contains('Answer Question').click();
        cy.get('#answerUsernameInput').type('joym');
        cy.get('#answerTextInput').type(answers[0]);
        cy.contains('Post Answer').click();
        cy.get('.answerText').each(($el, index) => {
            cy.contains(answers[index]);
        });
        cy.contains('joym');
        cy.contains('0 seconds ago');
    });

    it('5.2 | Username is mandatory when creating a new answer', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Programmatically navigate using React router').click();
        cy.contains('Answer Question').click();
        cy.get('#answerTextInput').type("Test Anser 1");
        cy.contains('Post Answer').click();
        cy.contains('Username cannot be empty');
    });

    it('5.3 | Answer is mandatory when creating a new answer', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Programmatically navigate using React router').click();
        cy.contains('Answer Question').click();
        cy.get('#answerUsernameInput').type('joym');
        cy.contains('Post Answer').click();
        cy.contains('Answer text cannot be empty');
    });

    it('6.1 | Adds a question, click active button, verifies the sequence', () => {
        cy.visit('http://localhost:3000');
        
        // add a question
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question A');
        cy.get('#formTextInput').type('Test Question A Text');
        cy.get('#formTagInput').type('javascript');
        cy.get('#formUsernameInput').type('mks0');
        cy.contains('Post Question').click();

        // add an answer to question of React Router
        cy.contains('Programmatically navigate using React router').click();
        cy.contains('Answer Question').click();
        cy.get('#answerUsernameInput').type('mks1');
        cy.get('#answerTextInput').type('Answer to React Router');
        cy.contains('Post Answer').click();

        // go back to main page
        cy.contains('Questions').click();

        // add an answer to question of Android Studio
        cy.contains('android studio save string shared preference, start activity and load the saved string').click();
        cy.contains('Answer Question').click();
        cy.get('#answerUsernameInput').type('mks1');
        cy.get('#answerTextInput').type('Answer to android studio');
        cy.contains('Post Answer').click();

        // go back to main page
        cy.contains('Questions').click();

        // add an answer to question A
        cy.contains('Test Question A').click();
        cy.contains('Answer Question').click();
        cy.get('#answerUsernameInput').type('mks2');
        cy.get('#answerTextInput').type('Answer Question A');
        cy.contains('Post Answer').click();

        // go back to main page
        cy.contains('Questions').click();

        // clicks active
        cy.contains('Active').click();

        
        const qTitles = ['Test Question A', 'android studio save string shared preference, start activity and load the saved string', 'Programmatically navigate using React router',  'Quick question about storage on android', 'Object storage for a web application']
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        })
    })

    it('6.2 | Checks if a6 and a7 exist in q3 answers page', () => {
        const answers = ['Using GridFS to chunk and store content.', 'Storing content as BLOBs in databases.'];
        cy.visit('http://localhost:3000');
        cy.contains('Object storage for a web application').click();
        cy.get('.answerText').each(($el, index) => {
            cy.contains(answers[index]);
        });
    });

    it('6.3 | Checks if a8 exist in q4 answers page', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Quick question about storage on android').click();
        cy.contains('Store data in a SQLLite database.');
    });

    it('7.1 | Adds a question with tags, checks the tags existied', () => {
        cy.visit('http://localhost:3000');
        
        // add a question with tags
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question A');
        cy.get('#formTextInput').type('Test Question A Text');
        cy.get('#formTagInput').type('test1 test2 test3');
        cy.get('#formUsernameInput').type('mks1');
        cy.contains('Post Question').click();

        // clicks tags
        cy.contains('Tags').click();
        cy.contains('test1');
        cy.contains('test2');
        cy.contains('test3');
        
    })

    it('7.2 | Checks if all tags exist', () => {
        cy.visit('http://localhost:3000');
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

    it('7.3 | Checks if all questions exist inside tags', () => {
        cy.visit('http://localhost:3000');
        // all question no. should be in the page
        cy.contains('Tags').click();
        cy.contains('7 Tags');
        cy.contains('1 question');
        cy.contains('2 question');
        cy.contains('0 question')
    })

    it('8.1 | go to question in tag react', () => {
        cy.visit('http://localhost:3000');
        // all question no. should be in the page
        cy.contains('Tags').click();
        cy.contains('react').click();
        cy.contains('Programmatically navigate using React router')
    })

    it('8.2 | go to questions in tag storage', () => {
        cy.visit('http://localhost:3000');
        // all question no. should be in the page
        cy.contains('Tags').click();
        cy.contains('storage').click();
        cy.contains('Quick question about storage on android')
        cy.contains('Object storage for a web application')
    })

    it('8.3 | create a new question with a new tag and finds the question through tag', () => {
        cy.visit('http://localhost:3000');
        
        // add a question with tags
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question A');
        cy.get('#formTextInput').type('Test Question A Text');
        cy.get('#formTagInput').type('test1-tag1');
        cy.get('#formUsernameInput').type('mks1');
        cy.contains('Post Question').click();

        // clicks tags
        cy.contains('Tags').click();
        cy.contains('test1-tag1').click();
        cy.contains('Test Question A')  
    })

    it('9.1 | Adds a question with a hyperlink and verifies', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('How to add a hyperlink in Markdown?');
        cy.get('#formTextInput').type('Here is a link: [Google](https://www.google.com)');
        cy.get('#formTagInput').type('markdown');
        cy.get('#formUsernameInput').type('user1');
        cy.contains('Post Question').click();
        cy.contains('How to add a hyperlink in Markdown?').click();
    cy.get('#questionBody').find('a').should('have.attr', 'href', 'https://www.google.com');
    });

    it('9.2 | Create new answer should be displayed at the top of the answers page', () => {
        const answers = ['Check this link for more info: [Documentation](https://docs.example.com)', "React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.", "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router."];
        cy.visit('http://localhost:3000');
        cy.contains('Programmatically navigate using React router').click();
        cy.contains('Answer Question').click();
        cy.get('#answerUsernameInput').type('joym');
        cy.get('#answerTextInput').type('Check this link for more info: [Documentation](https://docs.example.com)');
        cy.contains('Post Answer').click();
        cy.get('.answerText').first().within(() => {
            cy.get('a').should('have.attr', 'href', 'https://docs.example.com');
        });
        cy.contains('joym');
        cy.contains('0 seconds ago');
    });

    it('9.3 | Tries to add a question with an invalid hyperlink and verifies failure', () => {
        const invalidUrls = [
            '[Google](htt://www.google.com)',
            '[Microsoft](microsoft.com)',
            '[](https://www.google.com/)',
            '[link]()',
            'dfv[]()',
            '[link](http://www.google.com/)',
            '[Google](https//www.google.com)',
            '[GitHub](http//github.com)',
            '[Facebook](https:/facebook.com)',
            '[Twitter](://twitter.com)',
            '[Netflix](htps://www.netflix)',
            '[Google](htts://www.goo<gle.com)',
            '[Google](http://www.google)',
            '[Dropbox](ttps://www.dropbox.c-m)',
            '[LinkedIn](ps:/www.linkedin.com)',
            '[Adobe](ttps://www.adobe..com)',
            '[Spotify](ttp:///www.spotify.com)',
            '[Reddit](http://reddit)',
            '[Wikipedia](tps://www.wikipedia=com)'
        ];
        cy.visit('http://localhost:3000');
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('How to add an invalid hyperlink in Markdown?');
        invalidUrls.forEach((url) => {
            cy.get('#formTextInput').clear().type(`This is an invalid link: ${url}`);
            cy.get('#formTagInput').clear().type('markdown');
            cy.get('#formUsernameInput').clear().type('user1');
            cy.contains('Post Question').click();
            cy.contains('Invalid hyperlink');
        });
        cy.visit('http://localhost:3000');
        cy.contains('How to add an invalid hyperlink in Markdown?').should('not.exist');
    });

    it('9.4 | Attempts to add an answer with an invalid hyperlink and verifies failure', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Programmatically navigate using React router').click();
        cy.contains('Answer Question').click();
        cy.get('#answerUsernameInput').type('user1');
        cy.get('#answerTextInput').type('Check this invalid link: [](https://wrong.url)');
        cy.contains('Post Answer').click();
        cy.contains('Invalid hyperlink');
        cy.visit('http://localhost:3000');
        cy.contains('Programmatically navigate using React router').click();
        cy.get('.answerText').should('not.contain', 'https://wrong.url');
    });


});






