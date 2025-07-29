# Max Node.js Course on Udemy

This course is to learn more about Node.js and to begin my journey on JavaScript backend development 🚀

We will work inside the app folder, so this way we can follow after the section 4 on this course!

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
10.
