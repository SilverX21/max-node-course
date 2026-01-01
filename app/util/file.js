const fs = require("fs");

const deleteFile = (filePath) => {
  //this here will delete a file in a given path
  fs.unlink(filePath, (err) => {
    if (err) throw err;
  });
};

exports.deleteFile = deleteFile;
