const num1Element = document.getElementById("num1") as HTMLInputElement;
const num2Element = document.getElementById("num2") as HTMLInputElement;
const buttonElement = document.querySelector("button")!;

//here we define the types of the arrays like this:
const numResults: number[] = [];
const textResults: string[] = [];

//we can have type aliases like this:
type NumOrString = number | string;

//we can also have types for objects like this:
type Result = { val: number; timestamp: Date};

//we can also have interfaces, where we can define the structure of the object
interface ResultObj {
  val: number;
  timestamp: Date;
}

//number | string is a union type, it means that the variable can be a number or a string
function add(num1: NumOrString, num2: NumOrString) {
  if (typeof num1 === "number" && typeof num2 === "number") {
    return num1 + num2;
  } else if (typeof num1 === "string" && typeof num2 === "string") {
    return num1+ ' ' + num2;
  }
  
  return +num1 + +num2;
}

//here we define the type of the resultObj, which is an object with a val property of type number
function printResult(resultObj: ResultObj)
{
  console.log("Result: " + resultObj.val);
  console.log("Timestamp: " + resultObj.timestamp);
}

buttonElement.addEventListener("click", () => {
  const num1 = num1Element.value;
  const num2 = num2Element.value;
  const result = add(+num1, +num2);
  numResults.push(result as number);
  const stringResult = add(num1, num2);
  textResults.push(stringResult as string);
  console.log("Addition result:", result);
  console.log("Addition string result:", stringResult);
  console.log("Array of numbers: ", numResults);
  console.log("Array of strings: ", textResults)
  printResult({val: result as number, timestamp: new Date()});
});
