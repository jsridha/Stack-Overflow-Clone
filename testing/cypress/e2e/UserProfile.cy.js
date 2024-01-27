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