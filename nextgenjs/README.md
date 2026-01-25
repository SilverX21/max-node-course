# Next Gen JavaScript

Here we will check ESModules and the newest features of JavaScript 🚀

## 1. Enabling ESModules

We can check some features in [ESModules documentation](https://esmodules.com/)

To get started, we need to follow these steps:

- Go to your package.json
- Search for the **types** section
- change it to use `module`
  ```json
  {
    "name": "nextgenjs",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "type": "module", //change this here to module
    "dependencies": {
      "express": "^5.2.1"
    }
  }
  ```
