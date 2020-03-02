const Calculator = require("../index");

describe("Calculator", () => {
  test("addCharacter: happy path", () => {
    expect(() => new Calculator()).not.toThrow();
    expect(() => new Calculator("123")).not.toThrow();
    const myCalc = new Calculator();
    myCalc.addCharacter("1");
    expect(myCalc.value()).toEqual("1");
    myCalc.addCharacter("2");
    expect(myCalc.value()).toEqual("12");
  });
  test("addCharacter: sad path", () => {
    const myCalc = new Calculator();
    expect(() => myCalc.addCharacter(1)).toThrow();
    expect(() => myCalc.addCharacter(true)).toThrow();
    expect(() => myCalc.addCharacter({ value: "1" })).toThrow();
    myCalc.addCharacter([]);
    expect(myCalc.value()).toEqual("");
  });
  test("setOperator: happy path", () => {
    const myCalc = new Calculator("1");
    expect(() => myCalc.setOperator("+")).not.toThrow();
  });
  test("execute '+': happy path", () => {
    const myCalc = new Calculator("1");
    expect(() => myCalc.execute()).not.toThrow();
    myCalc.setOperator("+");
    myCalc.execute();
    expect(myCalc.value()).toEqual("1");
    myCalc.setOperator("+");
    myCalc.addCharacter("2");
    myCalc.execute();
    expect(myCalc.value()).toEqual("3");
  });
  test("execute '-': happy path", () => {
    const myCalc = new Calculator("1");
    myCalc.setOperator("-");
    myCalc.execute();
    expect(myCalc.value()).toEqual("1");
    myCalc.setOperator("-");
    myCalc.addCharacter("2");
    myCalc.execute();
    expect(myCalc.value()).toEqual("-1");
  });
  test("execute '*': happy path", () => {
    const myCalc = new Calculator("1");
    myCalc.setOperator("*");
    myCalc.execute();
    expect(myCalc.value()).toEqual("0");
    myCalc.addCharacter("2");
    myCalc.setOperator("*");
    myCalc.addCharacter("2");
    myCalc.execute();
    expect(myCalc.value()).toEqual("4");
  });
  test("execute '÷': happy path", () => {
    const myCalc = new Calculator("4");
    myCalc.setOperator("÷");
    expect(() => myCalc.execute()).toThrow();
    expect(myCalc.value()).toEqual("0");
    myCalc.addCharacter("2");
    myCalc.execute();
    expect(myCalc.value()).toEqual("2");
    myCalc.addCharacter("2");
    myCalc.setOperator("÷");
    myCalc.addCharacter("2");
    myCalc.execute();
    expect(myCalc.value()).toEqual("11");
  });
});
