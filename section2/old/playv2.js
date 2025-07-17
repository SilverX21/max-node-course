const person1 = {
  name: "Max",
  age: 29,
  greet: () => console.log("Hi, I am " + this.name),
};

person1.greet(); // This will not work as expected due to the arrow function's lexical 'this' is referring to the global context

// To fix this, we can use a regular function
const person2 = {
  name: "Max",
  age: 29,
  greet() {
    console.log("Hi, I am " + this.name);
  },
};

person2.greet(); // This will work as expected, logging "Hi, I am Max"

const hobbies = ["Sports", "Cooking"];

// for of loop to iterate over an array
// for (let hobby of hobbies) {
//   console.log(hobby);
// }

//.map method is very useful for transforming arrays
//console.log(hobbies.map((hobby) => "Hobby: " + hobby));

//push method to add an item to the end of the array
//be aware that we are modyfing the hobbies, that is a constant, in this case, it will not throw an error, this is because we are not reassigning the constant, we are just modifying its content. An array is a reference type, so we can modify its content without reassigning it :)
hobbies.push("Programming");
console.log(hobbies);

const coppiedArray = hobbies.slice(); // creates a shallow copy of the array, we can define the start and end index if we want to copy only a part of the array, but if we don't pass any parameters, it will copy the whole array
console.log(coppiedArray);

//we can also use the spread operator to copy an array
const spreadArray = [...hobbies];
console.log("Spread array: " + spreadArray);

//we can also use the spread for objects
const copiedPerson = { ...person2 };
console.log("Copied person: ", copiedPerson);

//we also have the rest operator, it is similar to the spread operator, but it's used to merge multiple arguments into an array, and we use it in a function, then it's the rest operator
const toArray = (...args) => {
  return args;
};

console.log(toArray(1, 2, 3, 4, 5, 6, 7));
