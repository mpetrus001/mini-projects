module.exports = class Calculator {
  constructor(initValue) {
    this.currentValue = initValue ? initValue : "0";
    this.previousValue = "0";
    this.operator = "";
  }
  _operationEval() {
    const prevVal = parseFloat(this.previousValue),
      currVal = parseFloat(this.currentValue);
    return {
      "+": prevVal + currVal,
      "-": prevVal - currVal,
      "*": prevVal * currVal,
      "÷": prevVal / currVal
    };
  }
  addCharacter(char) {
    this.currentValue = [...this.currentValue, ...char].join("");
    // remove the leading 0
    if ([...this.currentValue][0] === "0") {
      this.currentValue = this.currentValue.slice(1);
    }
  }
  removeCharacter() {
    this.currentValue = this.currentValue.slice(
      0,
      this.currentValue.length - 1
    );
    // prevents value being an empty string
    if (this.currentValue.length < 1) {
      this.currentValue = "0";
    }
  }
  clearAllValues() {
    this.currentValue = "0";
    this.previousValue = "0";
    this.operator = "";
  }
  setOperator(operation) {
    if (this.operator.length < 1) {
      this.previousValue = this.currentValue;
      this.currentValue = "0";
      this.operator = operation;
      return null;
    }
    this.previousValue = this._operationEval()[operation].toString();
    this.currentValue = "0";
    this.operator = operation;
  }
  execute() {
    if (this.operator.length < 1) {
      return null;
    }
    if (this.operator === "÷" && parseFloat(this.currentValue) === 0) {
      throw new Error("Cannot divide by zero");
    }
    this.currentValue = this._operationEval()[this.operator].toString();
    this.previousValue = "0";
    this.operator = "";
  }
  value() {
    return this.currentValue;
  }
  debug() {
    console.table({
      current: this.currentValue,
      previous: this.previousValue,
      operator: this.operator
    });
  }
};
