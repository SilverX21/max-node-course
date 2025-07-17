//here we are using a callback function
//a callback function is a function that is passed as an argument to another function
//it will be executed after the function it is passed to has completed its execution
//this is a common pattern in JavaScript for handling asynchronous operations
const fetchData = () => {
  //a promise is an object that represents the eventual completion (or failure) of an asynchronous operation and its resulting value
  //usually, packages we use in JavaScript return promises, so we don't need to create them ourselves
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Done!"); //this will be the value that the promise resolves to
    }, 1500);
  });
  return promise;
};

//this code here is asynchronous as it can be
//executed in the background while other code runs
//setTimetout is a function that takes a callback and a time in milliseconds to wait before executing the callback
//watch out with the callback hell, it can get messy if you have many nested callbacks :)
setTimeout(() => {
  console.log("Timer is done");
  fetchData()
    .then((text) => {
      console.log(text);
      return fetchData();
    })
    .then((text2) => {
      console.log(text2);
    });
}, 2000);

console.log("hi");
console.log("Hello again");
