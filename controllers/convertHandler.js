const unitCon = {
  kg: { to: "lbs", name: "kilograms", logic: 2.2046244 },
  lbs: { to: "kg", name: "pounds", logic: 0.453592 },
  gal: { to: "L", name: "gallons", logic: 3.78541 },
  L: { to: "gal", name: "liters", logic: 0.264172 },
  km: { to: "mi", name: "kilometers", logic: 0.621373 },
  mi: { to: "km", name: "miles", logic: 1.60934 },
};

function ConvertHandler() {
  this.getNum = function (input) {
    if (
      !input.match(
        /^(?:(?:\d+\.?)|\d+(?:[.\/]\d+){0,2}|(?:\.\d+)|(?:(\d*\.?\d+)\/(\d+(?:\.(?:\d+)?)?)))?[a-zA-Z]{1,}$/
      )
    ) {
      return null;
    }
    const regex = /^[0-9\./]+/;
    //console.log("hereee222"); //^((\.?\d+\d{0,})\/(\d+\.?\d{0,}))|((\d+\.?\d{0,})\/(\d+\.?\d{0,}))$
    const regex2 = /^(?:(\d*\.?\d+)\/(\d+(?:\.(?:\d+)?)?))[a-zA-Z]{1,}/; ///^(\d*\.?\d+)\/(\d+(?:\.(?:\d+)?)?)/
    const match = input.match(regex2);
    if (match) {
      const num1 = parseFloat(match[1]);
      const num2 = parseFloat(match[2]);
      //console.log(num1, num2);
      return num1 / num2;
    }

    const result = input.match(regex);
    if (!result) {
      return 1;
    }

    // console.log("getNum result is " + result);
    // console.log(result);
    return parseFloat(result[0]);
  };

  this.getUnit = function (input) {
    const regex = /(kg|gal|L|mi|km|lbs)$/i;
    const result = input.match(regex);
    if (!result) {
      return false;
    }
    //console.log("getUnitresult is " + result);
    //console.log("getUnitresult0 is " + result[0]);
    //console.log("getUnitresult1 is " + result[1]);
    if (result[0].toLowerCase() == "l") {
      return "L";
    }
    return result[0].toLowerCase();
  };

  this.getReturnUnit = function (initUnit) {
    let result = unitCon[initUnit].to;
    return result;
  };

  this.spellOutUnit = function (unit) {
    return unitCon[unit].name;
  };

  this.convert = function (initNum, initUnit) {
    //const galToL = 3.78541;
    //const lbsToKg = 0.453592;
    //const miToKm = 1.60934;
    let result = unitCon[initUnit].logic * initNum;
    // console.log("result is " + result.toFixed(5));
    // console.log(
    //   "result after formatting is " +
    //     result
    //       .toFixed(5)
    //       .toString()
    //       .match(/\d+(?:.\d{1,5})?/)
    // );
    return result
      .toFixed(5)
      .toString()
      .match(/\d+(?:.\d{5})?/)[0];
  };

  this.getString = function (initNum, initUnit, returnNum, returnUnit) {
    const spellingOfInitUnit = this.spellOutUnit(initUnit);
    const spellingOfReturnUnit = this.spellOutUnit(returnUnit);

    const string =
      initNum +
      " " +
      spellingOfInitUnit +
      " converts to " +
      returnNum +
      " " +
      spellingOfReturnUnit;
    return string;
  };
}

module.exports.ConvertHandler = ConvertHandler;
module.exports.unitCon = unitCon;
