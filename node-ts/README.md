# Node + TypeScript

## 1. Set up

Here we will start by setting up our environment for Node.js and TypeScript 🚀
For missing parts, check this [Node.js + TypeScript Guide](https://medium.com/@gabrieldrouin/node-js-2025-guide-how-to-setup-express-js-with-typescript-eslint-and-prettier-b342cd21c30d#2245)

Let's tens follow these steps:

- **TypeScript init**: `tsc --init`
- **Npm init**: `npm init`
- **Express**: let's install express `npm install --save express`
- **Body parser**: `npm install --save body-parser`
- **Node types**: `npm install --save-dev @types/node` -> the @types contains translations for javascript code
- **Express types**: `npm install --save-dev @types/express`
- **Body Parser types**: `npm install --save-dev @types/body-parser`
- **Module types**: Next, we need to set the types in our `package.json` file as `module`:

```javascript
  {
    "name": "ts",
    "version": "1.0.0",
    "type": "module",
    "main": "app.js",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1"
    },
    //...
  }

```

- **Prettier setup**: let's install prettier so we can have formatting enabled in our app: `npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-plugin-prettier eslint-config-prettier`
- **ESLint setup**: now let's install `ESLint` like this: `npm init @eslint/config@latest`
