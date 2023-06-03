"use strict";

const expect = require("chai").expect;
const { ConvertHandler } = require("../controllers/convertHandler.js");

function app(app) {
  let convertHandler = new ConvertHandler();

  app.route("/api/convert").get((req, res) => {
    const input = req.query.input;
    if (!input) {
      res.json("invalid unit");
      return;
    }

    const regexForUnit = /[\d.]?(?:kg|gal|L|mi|km|lbs)$/i;
    const regexForDigit =
      /^(?:(?:(?:\d+\.)|\d+(?:[\.\/]\d+){0,2}|(?:\.\d+)|(?:(\d*\.?\d+)\/(\d+(?:\.(?:\d+)?)?))))?[a-zA-Z]{1,}$/; ///^(\d*\.?\d+)\/(\d+(?:\.(?:\d+)?)?)/g
    const regexForAll =
      /^(?:(?:\d+\.)|\d+([\./]\d+){0,2}(?:\.\d+)?|(?:\.\d+))?(?:kg|gal|L|mi|km|lbs)$/i;

    if (!input.match(regexForUnit) && input.match(regexForDigit)) {
      res.json("invalid unit");
      return;
    } else if (!input.match(regexForDigit) && input.match(regexForUnit)) {
      res.json("invalid number");
      return;
    } else if (!input.match(regexForAll)) {
      res.json("invalid number and unit");
      return;
    }
    const initNum = convertHandler.getNum(input);
    const initUnit = convertHandler.getUnit(input);
    const returnNum = convertHandler.convert(initNum, initUnit);
    const returnUnit = convertHandler.getReturnUnit(initUnit);
    const string = convertHandler.getString(
      initNum,
      initUnit,
      returnNum,
      returnUnit
    );

    res.json({
      initNum,
      initUnit,
      returnNum: parseFloat(returnNum),
      returnUnit,
      string,
    });
  });
}

module.exports = { app };
