# Max Node.js Course on Udemy

This course is to learn more about Node.js and to begin my journey on JavaScript backend development 🚀

We will work inside the app folder, so this way we can follow after the section 4 on this course!

## 0. First setup
Check this video out for the walkthrough: https://www.youtube.com/watch?v=GTDYsV5pyZU

Let's start to setup the project, so we can have a better developer experience.

### 0.1 Eslint
Let's install `eslint` first: `npm init @eslint/config@latest`
Let's set it up like this:

√ What do you want to lint? · javascript
√ How would you like to use ESLint? · problems
√ What type of modules does your project use? · commonjs
√ Which framework does your project use? · none
√ Does your project use TypeScript? · No / Yes
√ Where does your code run? · node

It will generate the following file: `eslint.config.mjs`

Then, let's add a new script to the package.json:
```
"lint": "eslint"
```

This will output in the terminal errors, problems and other warnings of your application

Check the docs for `eslint`: https://eslint.org/docs/latest/use/configure/

### 0.2 Prettier
For Prettier, you can check the docs here for the integration with linters: https://prettier.io/docs/integrating-with-linters

To integrate with `eslint` we can first install these packages: 
- `npm install --save-dev eslint-plugin-prettier eslint-config-prettier` 
- `npm install --save-dev --save-exact prettier`


## 1. Section 4 - Improved Development Workflow and Debugging

1. First, we created the app folder, then we proceeded to run the following script, inside the app directory: `npm init`
2. Then, let's add the start line to the `package.json` file:

```json
"scripts": {
    ...
    "start": "node app.js"
}
```

This will run every time you run the `npm start` command, so if you need to do something everytime you run the project, you can add it here 👌 3. If we add another line inside the scripts section:

```json
"scripts": {
    "start": "node app.js",
    "start-server": "node app.js"
}
```

If you now needed to start using the `start-server` script, you should do something like this: `npm run start-server`

4. If we want to install a package from `npm` you can run the following command: `npm install package_name`
5. There are two types of packages: production dependencies, that we use in production, and development dependencies, that we only use for the development. For this case, we are going to install `nodemon`.

   This package is a development dependency, so it will only be used during the development phase (this package restarts the server every time we update our code, instead of running the commands manually, we can use this package to restart it).
   In this case, we need to add `--save-dev` at the end, something like this: `npm install nodemon --save-dev`. This way the npm can know which of these packages is for production 🚀
   If we installed it as `npm install nodemon --save`, it would install it as a production package.
   If we installed it as `npm install nodemon -g`, it would install it globally.

6. If we want to start using nodemon, we can change the `start` script in the `package.json` file to use it:

```json
"scripts": {
    "start": "nodemon app.js"
}
```

7. To use the debugger with nodemon, you can do the following:

   ![setting debugger options](/images/1.set%20debugger%20options.png)

   We need to go to `Run` > `Add Configuration...`
   Then, the file `launch.json` will be created, there you'll need to add the following options inside the `configurations` array:

   ```json
    "restart": true,
    "runtimeExecutable": "nodemon",
    "console": "integratedTerminal"
   ```

   This will enable the VS Code to restart the server, using nodemon.
   NOTE: There could be an error that it fails. This is due to nodemon not being installed globally, so we need to install it like this: `npm install nodemon -g`
   We also added the option `console` to the options so we could have the loggs in the integrated terminal off VS Code.

## Section 5 - Working with Express.js

8. To install Express, we just need to run the command `npm install --save express`. We use the `--save` because this will be on production 🚀
9. Let's also install the body-parser package to parse requests from the front end: `npm install --save body-parser`

## Section 6 - Working with dynamic content & adding templating engines

10. let's install the folllwing: `npm install --save ejs pug express-handlebars`
    Here we have some of the templates for dynamic content using html 💪

## Section 9 - Sql Introduction

Here we will install MySQL and work with it using node!

11. let's install `npm install --save mysql2`

## Section 10 - Sequelize

12. let's install the package: `npm install --save sequelize`
    Sequelize will require `mysql2` to be installed before being installed

## Section 12 - MongoDb
13. let's install the package: `npm install --save mongodb`
then let's set it up like this:
```javascript
const mongodb = require("mongodb");
const colors = require("colors");

const MongoClient = mongodb.MongoClient;
let _db;

const mongoConnect = (callback) => {
    console.log("MongoDB connecting...");
    console.log(".env variable for connection string: " + process.env.MONGO_DB_CONNECTION_STRING);

    MongoClient.connect(process.env.MONGO_DB_CONNECTION_STRING)
        .then(client => {
            console.log("Connected to MongoDB".green);
            _db = client.db();
            callback(client);
        })
        .catch(err => {
            console.log(err.red)
            throw err;
        });
};

const getDb = () => {
    if (_db) {
        return _db;
    }

    throw "No database found";
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

```

14. For the connection string, we will need to have a .env file for best practices, to use this approach, we need to install this package: `npm install dotenv` 
Then we need to import it in the app.js file for global usage: `require("dotenv").config()`

## Section 13 - Working with Mongoose

15. To add Mongoose to our project, we need to install the package `npm install --save mongoose` 

Mongoose is an ODM (Object Document Mapper), it can pick up our documents and help us to focus on our data instead of focusing in our queries