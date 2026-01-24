const { expect } = require("chai");

const chai = require("chai").expect;

//mocha has a function called it, where we setup our test cases
//we should add a string about what the test will do, in plain english
it("should add numbers correctly", function () {
  const num1 = 2;
  const num2 = 3;
  //hwew we use chai to make our assertions
  expect(num1 + num2).to.equal(5);
});

it("should not give a result of 6", function () {
  const num1 = 2;
  const num2 = 3;
  //hwew we use chai to make our assertions
  expect(num1 + num2).not.to.equal(6);
});
