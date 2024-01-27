// Setup database with initial test data.

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Importing Factory
let Factory = require("./models/itemFactory");

// Defining functions to create tags, comments, answers, questions, and users
async function tagCreate(name, created_by) {
    let tagDetail = { name: name };
    if (created_by !== false) tagDetail.created_by = created_by;
    
    let tag = Factory.createElement('Tag', tagDetail);
    return tag.save();
}

async function commentCreate(text, comment_by, votes, cmnt_date_time) {
    let cmntDetail = { text: text};
    if (comment_by !== false) cmntDetail.comment_by = comment_by;
    if (votes !== false) cmntDetail.votes = votes;
    if (cmnt_date_time !== false) cmntDetail.cmnt_date_time = cmnt_date_time;

    let comment = Factory.createElement('Comment', cmntDetail);
    return comment.save();
}

async function answerCreate(text, ans_by, ans_date_time, comments, votes) {
    let answerDetail = { text: text };
    if (ans_by !== false) answerDetail.ans_by = ans_by;
    if (ans_date_time !== false) answerDetail.ans_date_time = ans_date_time;
    if (comments !== false) answerDetail.comments = comments;
    if (votes !== false) answerDetail.votes = votes;

    let answer = Factory.createElement('Answer', answerDetail);
    return answer.save();
}

async function questionCreate(title, text, tags, answers, asked_by, ask_date_time, views, comments, votes, lastActive) {
    let qstnDetail = {
        title: title,
        text: text,
        tags: tags,
        asked_by: asked_by,
        lastActive: new Date(0)
    };

    if (answers !== false) {
        qstnDetail.answers = answers;
        // Find the most recent answer date
        let mostRecentDate = new Date(0);
        for (let answer of answers) {
            if (answer.ans_date_time > mostRecentDate) {
                mostRecentDate = answer.ans_date_time;
            }
        }
        qstnDetail.lastActive = mostRecentDate;
    }

    if (ask_date_time !== false) qstnDetail.ask_date_time = ask_date_time;
    if (views !== false) qstnDetail.views = views;
    if (comments !== false) qstnDetail.comments = comments;
    if (votes !== false) qstnDetail.votes = votes;
    if (lastActive !== false) qstnDetail.lastActive = lastActive;

    let qstn = Factory.createElement('Question', qstnDetail);
    return qstn.save();
}

async function userCreate(username, email, password, created_at, questions, answers, tags, reputation) {
    let userDetail = { username: username};
    if (email !== false) userDetail.email = email;
    if (password !== false) userDetail.password = await bcrypt.hash(password, 10);
    if (created_at !== false) userDetail.created_at = created_at;

    
    if (questions !== false) userDetail.questions = questions;
    if (answers !== false) userDetail.answers = answers;
    if (tags !== false) userDetail.tags = tags;
    if (reputation !== false) userDetail.reputation = reputation;

    let user = Factory.createElement('User', userDetail);
    return user.save();
}

// Populating the database with records
const populate = async () => {
    // Importing mongoose and connecting to the MongoDB instance

    await mongoose.connect('mongodb://localhost:27017/fake_so', { useNewUrlParser: true, useUnifiedTopology: true });
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));

    const u1 = await userCreate('hamkalo', 'temp@example.com', "p1",  new Date('2023-11-20T03:14:42'), [], [], [], reputation=50);
    const u2 = await userCreate('azad', 'temp2@example.com', "p2", new Date('2023-11-23T08:14:00'), [], [], [], reputation=50);
    const u3 = await userCreate('abaya', 'temp3@example.com', "p3", new Date('2023-11-18T09:14:00'), [], [], [], reputation=10);
    const u4 = await userCreate('alia', 'temp4@example.com', "p4", new Date('2023-11-12T03:20:00'), [], [], [], reputation=350);
    const u5 = await userCreate('sana', 'temp5@example.com', "p5", new Date('2023-11-01T15:14:19'), [], [], [], reputation=100);
    const u6 = await userCreate('abhi3241', 'temp6@example.com', "p6", new Date('2023-02-19T18:10:59'), [], [], [], reputation=50);
    const u7 = await userCreate('mackson3332', 'temp7@example.com', "p7", new Date('2023-02-22T17:09:00'), [], [], [], reputation=40);
    const u8 = await userCreate('ihba001', 'temp8@example.com', "p8", new Date('2023-03-22T21:07:53'), [], [], [], reputation=30);
    const u9 = await userCreate('Joji John', 'temp9@example.com', "p9", new Date('2022-01-20T02:50:00'), [], [], [], reputation=50);
    const u10 = await userCreate('saltyPeter', 'temp10@example.com', "p10", new Date('2023-01-10T11:14:30'), [], [], [], reputation=50);
    const u11 = await userCreate('monkeyABC', 'temp11@example.com', "p11", new Date('2023-02-18T01:00:15'), [], [], [], reputation=25);
    const u12 = await userCreate('elephantCDE', 'temp12@example.com', "p12", new Date('2023-03-10T14:18:01'), [], [], [], reputation=5);
    const u13 = await userCreate('testUser', 'test@test.com', 'p23', new Date('2023-10-23T09:00:00'),[],[],[], reputation=200);

    const t1 = await tagCreate('react', u9);
    const t2 = await tagCreate('javascript', u9);
    const t3 = await tagCreate('android-studio', u10);
    const t4 = await tagCreate('shared-preferences', u10);
    const t5 = await tagCreate('storage', u11);
    const t6 = await tagCreate('website', u11);
    const t7 = await tagCreate('Flutter', u13);
    const t8 = await tagCreate('Python', u13);
    const t9 = await tagCreate('Java', u13);
    const t10 = await tagCreate('C++', u13);
    const t11 = await tagCreate('angular', u9);
    const t12 = await tagCreate('node.js', u9);
    const t13 = await tagCreate('mobile-app', u8);
    const t14 = await tagCreate('database', u10);
    const t15 = await tagCreate('cloud-computing', u11);
    const t16 = await tagCreate('web-development', u11);
    const t17 = await tagCreate('UI-design', u13);
    const t18 = await tagCreate('data-analysis', u13);
    const t19 = await tagCreate('machine-learning', u13);
    const t20 = await tagCreate('algorithm', u13);

    const c1 = await commentCreate('test comment 1', u1, 50);
    const c2 = await commentCreate('This is a great post!', u2, 55);
    const c3 = await commentCreate('I totally agree with you!', u3, 60);
    const c4 = await commentCreate('Nice work on this one!', u4, 70);
    const c5 = await commentCreate('I found this very informative.', u5, 45);
    const c6 = await commentCreate('Keep up the good work!', u6, 75);
    const c7 = await commentCreate('Can you explain this further?', u7, 65);
    const c8 = await commentCreate('I have a similar experience.', u8, 50);
    const c9 = await commentCreate('Thanks for sharing this!', u9, 70);
    const c10 = await commentCreate('I have a different perspective.', u10, 55);
    const c11 = await commentCreate('I\'m not sure I understand.', u11, 60);
    const c12 = await commentCreate('This is so inspiring!', u12, 80);
    const c13 = await commentCreate('I had a similar thought.', u13, 50)
    const c14 = await commentCreate('Can you recommend a book on this topic?', u1, 65);
    const c15 = await commentCreate('I appreciate the effort you put into this.', u2, 75);
    const c16 = await commentCreate('I\'m looking forward to your next post!', u3, 70);
    const c17 = await commentCreate('This made me rethink my approach.', u4, 60);
    const c18 = await commentCreate('I have some suggestions for improvement.', u5, 55);
    const c19 = await commentCreate('I\'m glad I stumbled upon this.', u6, 65);
    const c20 = await commentCreate('I\'m excited to learn more about this topic.', u7, 75);
    const c21 = await commentCreate('I agree, sometimes the examples can be confusing. Writing your own code can be a good learning experience!', u1, 60);
    const c22 = await commentCreate('I faced the same issue with the examples. Writing custom code can provide better clarity.', u2, 70);
    const c23 = await commentCreate('Can you explain more about storing content as BLOBs? How does it work?', u3, 55);
    const c24 = await commentCreate('I have some experience with BLOB storage. It can be efficient for certain use cases.', u4, 65);
    const c25 = await commentCreate('What is GridFS, and how does it work for storing content?', u5, 70);
    const c26 = await commentCreate('I\'ve used GridFS in my projects, and it\'s a great way to handle large files.', u6, 75);
    const c27 = await commentCreate('Storing data in SQLite is common for mobile apps. It\'s lightweight and easy to use.', u7, 50);
    const c28 = await commentCreate('I\'ve had success with SQLite for offline data storage in my Android apps.', u8, 55);
    const c29 = await commentCreate('MongoDB GridFS is a good choice for handling large files. How do you set it up?', u9, 65);
    const c30 = await commentCreate('I\'ve used GridFS for multimedia content in my web applications. It scales well.', u10, 60);
    const c31 = await commentCreate('I appreciate your approach to solving this problem. Custom solutions often lead to better understanding.', u3, 70);
    const c32 = await commentCreate('I\'ve faced similar confusion with examples in the past. Writing your own code can definitely clarify things.', u4, 75);
    const c33 = await commentCreate('Security is paramount for any API. Make sure to use HTTPS, input validation, and proper authentication methods.', u8, 80);
    const c34 = await commentCreate('Consider using libraries like Helmet.js to set security-related HTTP headers and sanitize user inputs to prevent common vulnerabilities.', u9, 75);
    const c35 = await commentCreate('I also recommend implementing rate limiting and request throttling to protect against DDoS attacks and abusive clients.', u10, 70);
    const c36 = await commentCreate('Regularly update your dependencies and follow security best practices for Node.js to stay protected against known vulnerabilities.', u11, 85);


    const a1 = await answerCreate('React Router is mostly a wrapper around the history library. history handles interaction with the browser\'s window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don\'t have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.', u1, new Date('2023-11-20T03:24:42'), [c1, c2, c3, c4, c5]);
    const a2 = await answerCreate('On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.', u2, new Date('2023-11-23T08:24:00'));
    const a3 = await answerCreate('Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.', u3, new Date('2023-11-18T09:24:00'));
    const a4 = await answerCreate('YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);', u4, new Date('2023-11-12T03:30:00'));
    const a5 = await answerCreate('I just found all the above examples just too confusing, so I wrote my own. ', u5, new Date('2023-11-01T15:24:19'));
    const a6 = await answerCreate('Storing content as BLOBs in databases.', u6, new Date('2023-02-19T18:20:59'));
    const a7 = await answerCreate('Using GridFS to chunk and store content.', u7, new Date('2023-02-22T17:19:00'));
    const a8 = await answerCreate('Store data in a SQLLite database.', u8, new Date('2023-03-22T21:17:53'));
    const a9 = await answerCreate('Using MongoDB to store binary data as GridFS chunks.', u13, new Date('2023-04-10T14:25:00'));
    const a10 = await answerCreate('Storing images as base64 encoded strings in JSON fields.', u13, new Date('2023-04-15T10:30:00'));
    const a11 = await answerCreate('Using Amazon S3 for scalable storage of binary content.', u13, new Date('2023-04-20T16:45:00'));
    const a12 = await answerCreate('I prefer using Google Cloud Storage for scalable storage.', u1, new Date('2023-04-21T14:30:00'));
    const a13 = await answerCreate('Azure Blob Storage is also a great option for scalable binary content storage.', u2, new Date('2023-04-22T11:15:00'));
    const a14 = await answerCreate('How does Amazon S3 compare to other cloud storage solutions like Google Cloud Storage or Azure Blob Storage?', u3, new Date('2023-04-23T09:45:00'));
    const a15 = await answerCreate('I\'ve had a positive experience with Amazon S3. It\'s reliable and offers good performance.', u4, new Date('2023-04-24T13:20:00'));
    const a16 = await answerCreate('Is there a specific use case you have in mind for Amazon S3?', u5, new Date('2023-04-25T10:10:00'));
    const a17 = await answerCreate('I recommend exploring Amazon S3\'s features like versioning and lifecycle policies for effective content management.', u6, new Date('2023-04-26T12:05:00'));
    const a18 = await answerCreate('Consider using Amazon CloudFront in combination with S3 for content delivery.', u7, new Date('2023-04-27T15:55:00'));
    const a19 = await answerCreate('I\'d be happy to provide more details on Amazon S3\'s capabilities. What specific information are you looking for?', u8, new Date('2023-04-28T17:30:00'));
    const a20 = await answerCreate('I\'m not familiar with Amazon S3. Can you explain its advantages over traditional storage solutions?', u9, new Date('2023-04-29T08:40:00'));
    const a21 = await answerCreate('I just found all the above examples just too confusing, so I wrote my own.', u5, new Date('2023-11-01T15:30:00'), [c21, c22]);
    const a22 = await answerCreate('Storing content as BLOBs in databases can be an effective approach.', u7, new Date('2023-02-19T18:40:00'), [c23, c24, c31, c32]);
    const a23 = await answerCreate('Using GridFS to chunk and store content is a reliable method for handling large files.', u8, new Date('2023-02-22T17:45:00'), [c25, c26]);
    const a24 = await answerCreate('Storing data in a SQLite database is a common choice for mobile app development.', u9, new Date('2023-03-22T21:30:00'), [c27, c28]);
    const a25 = await answerCreate('Using MongoDB to store binary data as GridFS chunks is a scalable solution for handling large files.', u10, new Date('2023-04-10T14:45:00'), [c29, c30]);

    const q1 = await questionCreate('Programmatically navigate using React router', 'the alert shows the proper index for the li clicked, and when I alert the variable within the last function Im calling, moveToNextImage(stepClicked), the same value shows but the animation isnt happening. This works many other ways, but Im trying to pass the index value of the list item clicked to use for the math to calculate.', [t1, t2], [a1, a2], u9, new Date('2022-01-20T03:00:00'), 10, [c1, c2, c3, c4, c5], 20, new Date('2023-11-23T08:24:00'));
    const q2 = await questionCreate('android studio save string shared preference, start activity and load the saved string', 'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.', [t3, t4, t2], [a3, a4, a5], u10, new Date('2023-01-10T11:24:30'), 121, [c3, c4, c5], 100, new Date('2023-11-12T03:30:00'));
    const q3 = await questionCreate('Object storage for a web application', 'I am currently working on a website where, roughly 40 million documents and images should be served to its users. I need suggestions on which method is the most suitable for storing content with subject to these requirements.', [t5, t6], [a6, a7], u11, new Date('2023-02-18T01:02:15'), 200, [c1, c2], 150,  new Date('2023-02-19T18:20:59'));
    const q4 = await questionCreate('Quick question about storage on android', 'I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains', [t3, t4, t5], [a8], u12, new Date('2023-03-10T14:28:01'), 103, [c1, c2, c5], 200, new Date('2023-03-22T21:17:53'));
    const q5 = await questionCreate('How to implement user authentication in a Node.js app using Passport.js?', 'I want to add user authentication to my Node.js application, and I heard about Passport.js. Can someone provide a step-by-step guide on how to implement user authentication using Passport.js?', [t1, t2, t3], [a1, a2], u13, new Date('2023-01-15T14:45:00'), 87, [], 10, new Date('2023-11-20T09:15:00'));
    const q6 = await questionCreate('How to optimize SQL queries for better performance?', 'I have a web application that\'s experiencing slow database performance. I suspect it\'s due to poorly optimized SQL queries. Can someone provide tips and best practices for optimizing SQL queries?', [t2, t4, t5], [a3, a4], u13, new Date('2023-02-05T09:30:00'), 62, [], 45, new Date('2023-11-25T16:22:00'));
    const q7 = await questionCreate('How to deploy a React application to AWS?', 'I\'ve developed a React app and want to deploy it to AWS for production. What are the recommended steps and best practices for deploying a React app on Amazon Web Services?', [t3, t5, t1], [a5, a6], u3, new Date('2023-03-20T17:10:00'), 105, [], 61,new Date('2023-12-01T11:50:00'));
    const q8 = await questionCreate('How to implement JWT authentication in a Python Flask app?', 'I\'m building a Python Flask application, and I\'d like to implement JWT-based authentication. Can someone guide me on how to set up JWT authentication in a Flask app?', [t1, t4, t6], [a7, a8], u13, new Date('2023-04-12T08:55:00'), 42, [], 72, new Date('2023-12-10T14:30:00'));
    const q9 = await questionCreate('How to use Redux for state management in a React Native app?', 'I\'m developing a React Native app, and I\'m interested in using Redux for state management. Can someone provide a step-by-step guide on how to integrate Redux into a React Native project and manage app state effectively?', [t1, t3, t5], [a9, a10], u5, new Date('2023-05-15T12:20:00'), 73, [], 84, new Date('2023-12-15T09:45:00'));
    const q10 = await questionCreate('What are the best practices for securing a Node.js REST API?', 'I\'m building a Node.js REST API, and I want to ensure it\'s secure against common vulnerabilities. What are the recommended best practices for securing a Node.js API?', [t7, t8, t9], [a11, a21, a22, a23, a24, a25], u6, new Date('2023-06-10T15:30:00'), 95, [c33, c34, c35, c36], 47, new Date('2023-12-20T14:10:00'));
    const q11 = await questionCreate('How to optimize React performance for large applications?', 'I have a React application that\'s getting slow as it grows. What are some strategies and best practices for optimizing React performance in large-scale applications?', [t1, t2], [a12], u1, new Date('2023-04-05T09:15:00'), 82, [c6, c7], 52, new Date('2023-12-05T12:30:00'));
    const q12 = await questionCreate('How to handle authentication and authorization in a Node.js app with Passport.js?', 'I\'m building a Node.js app and want to implement user authentication and authorization using Passport.js. What\'s the best approach to handle authentication and authorization in a Node.js application?', [t1, t2, t3], [a13], u2, new Date('2023-03-28T14:55:00'), 97, [c8, c9], 77, new Date('2023-12-08T10:20:00'));
    const q13 = await questionCreate('How to structure a Flutter app for scalability?', 'I\'m starting a Flutter project, and I want to ensure it\'s structured in a way that makes it scalable as the app grows. What\'s the recommended project structure and architecture for a scalable Flutter app?', [t7, t10], [a14], u3, new Date('2023-03-15T11:40:00'), 68, [c10, c11], 58, new Date('2023-12-02T15:45:00'));
    const q14 = await questionCreate('How to handle database migrations in a Python Django project?', 'I\'m working on a Python Django project, and I need guidance on how to handle database migrations effectively. What are the best practices for managing database migrations in a Django project?', [t8, t9], [a15], u4, new Date('2023-04-20T10:25:00'), 78, [c12, c13], 64, new Date('2023-12-15T08:00:00'));
    const q15 = await questionCreate('Best practices for securing a RESTful API in Express.js?', 'I\'ve developed a RESTful API using Express.js, and I want to ensure it\'s secure. What are the recommended best practices for securing a RESTful API built with Express.js?', [t1, t2], [a16], u5, new Date('2023-04-10T16:50:00'), 92, [c14, c15], 43, new Date('2023-12-03T11:55:00'));
    const q16 = await questionCreate('What are the differences between NoSQL and SQL databases?', 'I\'m exploring database options for my project, and I\'m curious about the differences between NoSQL and SQL databases. Can someone provide an overview of the key distinctions between these two types of databases?', [t4, t5], [a17], u6, new Date('2023-05-02T09:30:00'), 88, [c16, c17], 56, new Date('2023-12-18T13:40:00'));
    const q17 = await questionCreate('How to handle user sessions in a PHP web application?', 'I\'m developing a PHP web application and need to implement user sessions. What\'s the recommended approach for handling user sessions in a PHP application?', [t6, t8], [a18], u7,  new Date('2023-05-18T12:15:00'), 75,  [c18, c19], 62,  new Date('2023-12-22T09:10:00'));
    const q18 = await questionCreate('Best practices for front-end performance optimization in Angular?', 'I\'m working on an Angular project, and I want to optimize the front-end performance. What are the best practices for improving the performance of an Angular application?', [t11, t13], [a19],  u8,  new Date('2023-04-28T14:30:00'), 84,  [c20], 55,  new Date('2023-12-12T15:25:00'));
    const q19 = await questionCreate('How to set up a CI/CD pipeline for a Node.js application on AWS?',  'I want to set up a continuous integration and continuous deployment (CI/CD) pipeline for my Node.js application hosted on AWS. Can someone provide step-by-step instructions for configuring CI/CD on AWS?',[t7, t9],  [a20],  u9,  new Date('2023-05-25T10:50:00'), 72,  [], 51,  new Date('2023-12-17T12:45:00'));
    const q20 = await questionCreate( 'How to use machine learning for image classification?', 'I\'m interested in implementing machine learning for image classification tasks. What are the recommended libraries, frameworks, and steps to get started with image classification using machine learning?', [t19,t20, t17], [], u13, new Date('2023-05-10T16:20:00'), 89, [], 49, new Date('2023-05-10T16:20:00'));

    u1.answers.push(a1, a12);
    u2.answers.push(a2, a13);
    u3.answers.push(a3, a14);
    u4.answers.push(a4, a15);
    u5.answers.push(a5, a16, a21);
    u6.answers.push(a6, a17);
    u7.answers.push(a7, a18, a22);
    u8.answers.push(a8, a19, a23);
    u9.answers.push(a20, a24);
    u10.answers.push(a25);
    u13.answers.push(a9, a10, a11);
    
    u1.questions.push(q11);
    u2.questions.push(q12);
    u3.questions.push(q13, q7);
    u4.questions.push(q14);
    u5.questions.push(q15, q9);
    u6.questions.push(q16, q10);
    u7.questions.push(q17);
    u8.questions.push(q18);
    u9.questions.push(q1, q19);
    u10.questions.push(q2);
    u11.questions.push(q3);
    u12.questions.push(q4);
    u13.questions.push(q5, q6, q8, q20);
    
    u9.tags.push(t1, t2, t11, t12);
    u10.tags.push(t3, t4, t14); 
    u11.tags.push(t5, t6, t15, t16);
    u13.tags.push(t7, t8, t9, t10, t17, t18, t19, t20);

    await u1.save();
    await u2.save();
    await u3.save();
    await u4.save();
    await u5.save();
    await u6.save();
    await u7.save();
    await u8.save();
    await u9.save();
    await u10.save();
    await u11.save();
    await u12.save();
    await u13.save();

    if (db) db.close();
    console.log('done');
};

// Running the population function and handling errors
populate()
    .catch((err) => {
        console.log('ERROR: ' + err);
        if (db) db.close();
    });

console.log('processing ...');
