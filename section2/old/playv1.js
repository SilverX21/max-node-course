const name = "Max";
let age = 29;
const hasHobbies = true;

age = 30;

function summarizeUser(userName, userAge, userHasHobby) {
  return "Name is " + userName + ", age is " + userAge + ", and the user has hobbies: " + userHasHobby;
}

//arrow functions has the this keyword bound to the context in which they were defined
const summarizeUserV2 = (userName, userAge, userHasHobby) => {
  return `Name is ${userName}, age is ${userAge}, and the user has hobbies: ${userHasHobby}`;
};

//we can simplify the arrow function further when we have a single expression
const add = (a, b) => a + b;

//if we have a single parameter, we can omit the parentheses
const addOne = (a) => a + 1;

//if we have no parameters, we need to use empty parentheses
const addRandom = () => 1 + Math.random();

console.log(summarizeUser(name, age, hasHobbies));
console.log(summarizeUserV2(name, age, hasHobbies));
console.log(add(1, 2));
console.log(addOne(20));
console.log(addRandom());
