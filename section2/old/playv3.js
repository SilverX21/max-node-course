const person1 = {
  name: "Max",
  age: 29,
  greet() {
    console.log("Hi, I am " + this.name);
  },
};

//here we are using object destructuring to extract the name property from person1
const printName = ({ name }) => {
  console.log(name);
};

console.log(printName(person1)); // This will not work as expected due to the arrow function's lexical 'this' is referring to the global context

const { name, age } = person1;
console.log(`Name: ${name}, Age: ${age}`); // This will work as expected, logging "Name: Max, Age: 29"

//we can also use destructuring to extract multiple properties from an array like this
//it is extracted by position, so the first element will be assigned to hobby1 and the second to hobby2
const hobbies = ["Sports", "Cooking"];
const [hobby1, hobby2] = hobbies;
console.log(`Hobby 1: ${hobby1}, Hobby 2: ${hobby2}`);
