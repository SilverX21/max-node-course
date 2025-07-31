const path = require("path");

// This module exports the directory name of the main module, which is the entry point of the application (in our case, app.js).
// It provides the absolute path to the directory where the main application file is located.
// This is useful for constructing paths relative to the main application directory
module.exports = path.dirname(require.main.filename);
