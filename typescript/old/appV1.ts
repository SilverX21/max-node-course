const num1Element = document.getElementById("num1") as HTMLInputElement;
const num2Element = document.getElementById("num2") as HTMLInputElement;
const buttonElement = document.querySelector("button")!;

//we can add types in typescript by adding a colon after the variable name followed by the type
function add(num1: number, num2: number) {
  return num1 + num2;
}

buttonElement.addEventListener("click", () => {
  const num1 = num1Element.value;
  const num2 = num2Element.value;
  const result = add(+num1, +num2);
  console.log("Addition result:", result);
});
