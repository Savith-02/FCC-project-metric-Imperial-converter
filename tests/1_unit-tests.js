const chai = require("chai");
let assert = chai.assert;
const ConvertHandler =
  require("../controllers/convertHandler.js").ConvertHandler;
const unitCon = require("../controllers/convertHandler.js").unitCon;
let convertHandler = new ConvertHandler();

suite("Unit Tests", function () {
  suite("Input Handling Tests", () => {
    suite("Tests for digit part", () => {
      // #1
      test("Test getNum() with whole number input", function () {
        assert.match(
          convertHandler.getNum("12km"),
          /\d+/,
          "This output should be a int"
        );
      });
      // #2
      test("Test getNum() with deciaml number input", function () {
        assert.match(
          convertHandler.getNum("143.22lbs"),
          /\d+\.\d+/,
          "This output should be a float"
        );
      });
      // #3
      test("Test getNum() with fractional input", function () {
        assert.match(
          convertHandler.getNum("143/2L"),
          /\d+\.\d+/,
          "This output should be a float"
        );
        assert.match(
          convertHandler.getNum("100/2km"),
          /\d+/,
          "This output should be a int"
        );
        assert.match(
          convertHandler.getNum("22/7kg"),
          /\d+\.\d+/,
          "This output should be a float"
        );
      });
      // #4
      test("Test getNum() with fractional input with a decimal", function () {
        assert.match(
          convertHandler.getNum("14.3/2mi"),
          /\d+\.\d+/,
          "This output should be a float"
        );
        assert.match(
          convertHandler.getNum("30/2.5gal"),
          /\d+/,
          "This output should be a int"
        );
        assert.match(
          convertHandler.getNum("22.5/7.1km"),
          /\d+\.\d+/,
          "This output should be a float"
        );
      });
      // #5
      test("Test getNum() with a double-fraction", function () {
        assert.isNotOk(
          convertHandler.getNum("14.3//2mi"),
          "Should return false on a double-fraction 14.3//2"
        );
        assert.isNotOk(
          convertHandler.getNum("1./4/3km"),
          "Should return false on a double-fraction: 1./4/3"
        );
        assert.isNotOk(
          convertHandler.getNum("1/4.3/23km"),
          "Should return false on a double-fraction: 1/4.3/23"
        );
      });
      // #6
      test("Test getNum() with no numerical input", function () {
        const data = ["L", "mI", "KG", "LbS"];
        for (let i = 0; i < data.length; i++) {
          assert.match(
            convertHandler.getNum(data[i]),
            /1/,
            `This output of ${data[i]} should be 1`
          );
        }
      });
    });
    suite("Tests for unit part", () => {
      // #1
      test("Test getUnit() with valid inputs", function () {
        const trueData = ["12km", "5.7mi", "2/4L"];
        for (let i = 0; i < trueData.length; i++) {
          assert.isOk(
            convertHandler.getUnit(trueData[i]),
            `The output of ${trueData[i]} should be a string and therefor truthy`
          );
        }
      });
      // #2
      test("Test getUnit() with invalid inputs", function () {
        const falseData = ["12kAm", "5.7m_i", "2/4L.", "34.6/34lb,s"];
        for (let i = 0; i < falseData.length; i++) {
          assert.isNotOk(
            convertHandler.getUnit(falseData[i]),
            `The output of ${falseData[i]} should be a false and therefor falsey`
          );
        }
      });
      // #3
      test("Test getReturnUnit() with valid input units", function () {
        const data = ["km", "lBS", "34kg", "2/4L", "23.7/44.4mI"];
        for (let i = 0; i < data.length; i++) {
          assert.strictEqual(
            convertHandler.getReturnUnit(convertHandler.getUnit(data[i])),
            unitCon[convertHandler.getUnit(data[i])].to,
            `The output of ${data[i]} should be equal to ${
              unitCon[convertHandler.getUnit(data[i])].to
            }`
          );
        }
      });
      // #4
      test("Test spellOutUnit() with valid input units", function () {
        const data = ["km", "lBS", "34kg", "2/4L", "23.7/44.4mI"];
        for (let i = 0; i < data.length; i++) {
          assert.strictEqual(
            convertHandler.spellOutUnit(convertHandler.getUnit(data[i])),
            unitCon[convertHandler.getUnit(data[i])].name,
            `The output of ${data[i]} should be equal to ${
              unitCon[convertHandler.getUnit(data[i])].name
            }`
          );
        }
      });
    });
    suite("Test for convertion", () => {
      // const convert = (dataSet) => {
      //   for (let i = 0; i < dataSet.length; i++) {
      //     const initNum = convertHandler.getNum(dataSet[i][0]);
      //     const initUnit = convertHandler.getUnit(dataSet[i][0]);
      //     const returnNum = convertHandler.convert(initNum, initUnit);
      //     const returnUnit = convertHandler.getReturnUnit(initUnit);
      //     assert.strictEqual(
      //       returnNum + returnUnit,
      //       dataSet[i][1],
      //       `The output of ${dataSet[i][0]} should be equal to ${dataSet[i][1]}`
      //     );
      //   }
      // };
      // #1
      test("Test the conversion of lbs to kg", function () {
        const dataSet = [
          ["lbs", "0.45359kg"],
          ["3lBS", "1.36078kg"],
          ["8.1lbS", "3.67410kg"],
          ["4/5.5LBS", "0.32989kg"],
        ];
        for (let i = 0; i < dataSet.length; i++) {
          const initNum = convertHandler.getNum(dataSet[i][0]);
          const initUnit = convertHandler.getUnit(dataSet[i][0]);
          const returnNum = convertHandler.convert(initNum, initUnit);
          const returnUnit = convertHandler.getReturnUnit(initUnit);
          assert.strictEqual(
            returnNum + returnUnit,
            dataSet[i][1],
            `The output of ${dataSet[i][0]} should be equal to ${dataSet[i][1]}`
          );
        }
      });
      // #2
      test("Test the conversion of kg to lbs", function () {
        const dataSet = [
          ["5kg", "11.02312lbs"],
          ["10KG", "22.04624lbs"],
          ["2.5Kg", "5.51156lbs"],
          ["3/4Kg", "1.65347lbs"],
          ["1.4/67kg", "0.04607lbs"],
        ];
        for (let i = 0; i < dataSet.length; i++) {
          const initNum = convertHandler.getNum(dataSet[i][0]);
          const initUnit = convertHandler.getUnit(dataSet[i][0]);
          const returnNum = convertHandler.convert(initNum, initUnit);
          const returnUnit = convertHandler.getReturnUnit(initUnit);
          assert.strictEqual(
            returnNum + returnUnit,
            dataSet[i][1],
            `The output of ${dataSet[i][0]} should be equal to ${dataSet[i][1]}`
          );
        }
      });
      // #3
      test("Test the conversion of L to gal", function () {
        const dataSet = [
          ["L", "0.26417gal"],
          ["43l", "11.35940gal"],
          ["8.154L", "2.15406gal"],
          ["4/5.5L", "0.19213gal"],
        ];
        for (let i = 0; i < dataSet.length; i++) {
          const initNum = convertHandler.getNum(dataSet[i][0]);
          const initUnit = convertHandler.getUnit(dataSet[i][0]);
          const returnNum = convertHandler.convert(initNum, initUnit);
          const returnUnit = convertHandler.getReturnUnit(initUnit);
          assert.strictEqual(
            returnNum + returnUnit,
            dataSet[i][1],
            `The output of ${dataSet[i][0]} should be equal to ${dataSet[i][1]}`
          );
        }
      });
      // #4
      test("Test the conversion of gal to L", function () {
        const dataSet = [
          ["1gal", "3.78541L"],
          ["8GAL", "30.28328L"],
          ["2.5Gal", "9.46353L"],
          ["3/4Gal", "2.83906L"],
          ["1.4/67gaL", "0.07910L"],
        ];
        for (let i = 0; i < dataSet.length; i++) {
          const initNum = convertHandler.getNum(dataSet[i][0]);
          const initUnit = convertHandler.getUnit(dataSet[i][0]);
          const returnNum = convertHandler.convert(initNum, initUnit);
          const returnUnit = convertHandler.getReturnUnit(initUnit);
          assert.strictEqual(
            returnNum + returnUnit,
            dataSet[i][1],
            `The output of ${dataSet[i][0]} should be equal to ${dataSet[i][1]}`
          );
        }
      });
      // #5
      test("Test the conversion of mi to km", function () {
        const dataSet = [
          ["5mi", "8.04670km"],
          ["10MI", "16.09340km"],
          ["2.5Mi", "4.02335km"],
          ["3/4Mi", "1.20701km"],
        ];
        for (let i = 0; i < dataSet.length; i++) {
          const initNum = convertHandler.getNum(dataSet[i][0]);
          const initUnit = convertHandler.getUnit(dataSet[i][0]);
          const returnNum = convertHandler.convert(initNum, initUnit);
          const returnUnit = convertHandler.getReturnUnit(initUnit);
          assert.strictEqual(
            returnNum + returnUnit,
            dataSet[i][1],
            `The output of ${dataSet[i][0]} should be equal to ${dataSet[i][1]}`
          );
        }
      });
      // #6
      test("Test the conversion of km to mi", function () {
        const dataSet = [
          ["10km", "6.21373mi"],
          ["15KM", "9.32059mi"],
          ["3.5Km", "2.17481mi"],
          ["1/2Km", "0.31069mi"],
        ];
        for (let i = 0; i < dataSet.length; i++) {
          const initNum = convertHandler.getNum(dataSet[i][0]);
          const initUnit = convertHandler.getUnit(dataSet[i][0]);
          const returnNum = convertHandler.convert(initNum, initUnit);
          const returnUnit = convertHandler.getReturnUnit(initUnit);
          assert.strictEqual(
            returnNum + returnUnit,
            dataSet[i][1],
            `The output of ${dataSet[i][0]} should be equal to ${dataSet[i][1]}`
          );
        }
      });
    });
  });
});
