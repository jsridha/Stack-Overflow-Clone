## Instructions to setup and run project

1. Install the required packages in client, server, and testing subdirectories by executing npm install.
2. Populate the database by running node server/init.js.
3. Go to server/ and run nodemon server.js.
4. Go to client/ and run npm start.
5. For running cypress tests, go to testing/ and run npx cypress open.
6. The database can be dropped using, node server/destroy.js

## Test cases
For speed when running tests, the individual unit tests are separated into individual .cy.js files based on the use case being tested. Files are named after the use cases they are testing (the only exception is for Comments, these tests are in Answers.cy.js). In the case of two use cases having identical names (such as difference in use case between registered user and guest), both sets of tests are contained in the same file.

Tests are separated into individual .cy.js files based on the UseCase being tested. Files are named after the use cases they are testing (the only exception is for Comments, these tests are in Answers.cy.js). In the case of two use cases having identical names (such as difference in use case between registered user and guest), both sets of tests are contained in the same file. 

| Use-case Name   | Test case Name |
|-----------------|----------------|
| Create Account  | 1.1            |
|                 | 1.2            |
|                 | 1.3            |
|                 | 4.1            |
| Login           | 2.1            |
|                 | 2.2            |
|                 | 2.3            |
|                 | 2.4            |
|                 | 4.1            |
| Logout          | 3.1            |
| HomePage - Guest| 5.1            |
|                 | 5.2            |
|                 | 5.3            |
|                 | 5.4            |
|                 | 5.5            |
|                 | 5.6            |
|                 | 5.7            |
|                 | 5.8            |
|                 | 5.9            |
| Home Page - User| 6.1            |
|                 | 6.2            |
|                 | 6.3            |
|                 | 6.4            |
|                 | 6.5            |
|                 | 6.6            |
|                 | 6.7            |
|                 | 6.8            |
| Searching       | 7.1            |
|                 | 7.2            |
|                 | 7.3            |
|                 | 7.4            |
|                 | 7.5            |
| All Tags        | 8.1            |
|                 | 8.2            |
|                 | 8.3            |
|                 | 8.4            |
|                 | 8.5            |
| New Question    | 9.1            |
|                 | 9.2            |
|                 | 9.3            |
|                 | 9.4            |
|                 | 9.5            |
|                 | 9.6            |
|                 | 9.7            |
|                 | 9.8            |
|                 | 9.9            |
| Answers - Guest | 11.1           |
|                 | 11.2           |
|                 | 11.3           |
|                 | 11.4           |
|                 | 11.5           |
|                 | 11.6           |
|                 | 11.7           |
|                 | 11.8           |
| Answers - User  | 12.1           |
|                 | 12.2           |
|                 | 12.3           |
|                 | 12.4           |
|                 | 12.5           |
|                 | 12.6           |
|                 | 12.7           |
|                 | 12.8           |
|                 | 12.9           |
|                 | 12.10          |
|                 | 12.12          |
| Comments- Guest | 11.2           |
|                 | 11.4           |
|                 | 11.8           |
|                 | 11.9           |
| Comments- User  | 12.2           |
|                 | 12.4           |
|                 | 12.7           |
|                 | 12.10          |
|                 | 12.11          |
| New Answer      | 13.1           |
|                 | 13.2           |
|                 | 13.3           |
|                 | 13.4           |
| User Profile    | 14.1           |
|                 | 14.2           |
|                 | 14.3           |
|                 | 14.4           |
|                 | 15.1           |
|                 | 15.2           |
|                 | 15.3           |
|                 | 15.4           |
|                 | 15.5           |
|                 | 15.6           |
|                 | 16.1           |
|                 | 16.2           |
|                 | 17.1           |
|                 | 17.2           |
|                 | 17.3           |
|                 | 17.4           |


## Design Patterns Used

- Design Pattern Name: Factory Pattern (createElement function in itemFactory.js)
    - Problem Solved: the createElement function dynamically instantiates an object of the appropriate element type based on the type parameter. This allows you to create instances of different elements without having to specify their classes directly in the code.
    - Location in code where pattern is used: init.js, newanswerform.js, newquestionpage.js, registerpage.js, commentsubmission.js
- Design Pattern Name: Facade Pattern (/pages directory)
    - Problem Solved: Provides an overarching simplified interface for the more complex subroutines defined in the files within /pages directory.
    - Location in code where pattern is used: server.js
