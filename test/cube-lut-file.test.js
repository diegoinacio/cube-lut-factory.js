const assert = require("chai").assert;
const fs = require("fs");
const cubeLUT = require("../index");

describe("Parse from file", function () {
  describe("1D Cube LUT", function () {
    // ? Import 1D Cube LUT
    let lutContent = fs.readFileSync("./test/1DLUT.cube");
    // ? Parse to Cube LUT object
    let lutObject = cubeLUT.parse(lutContent);

    it("Test object title", function () {
      let title = lutObject.title;

      // ? Check type
      assert.typeOf(title, "string");
      // ? Check value
      assert.equal(title, "1D Identity Cube LUT");
    });

    it("Test object type", function () {
      let type = lutObject.type;

      // ? Check type
      assert.typeOf(type, "string");
      // ? Check value
      assert.equal(type, "1D");
    });

    it("Test object size", function () {
      let size = lutObject.size;

      // ? Check type
      assert.typeOf(size, "number");
      assert.isTrue(Number.isInteger(size));
      // ? Check value
      assert.equal(size, 4);
    });

    it("Test object domain", function () {
      let domainMin = lutObject.domainMin;

      // ? Check type
      assert.isArray(domainMin);
      // ? Check value
      assert.deepEqual(domainMin, [0, 0, 0]);
      // ? Check length
      assert.equal(domainMin.length, 3);
      // ? Check if all elements are numbers
      assert.isTrue(!domainMin.some(isNaN));

      let domainMax = lutObject.domainMax;

      // ? Check type
      assert.isArray(domainMax);
      // ? Check value
      assert.deepEqual(domainMax, [1, 1, 1]);
      // ? Check length
      assert.equal(domainMax.length, 3);
      // ? Check if all elements are numbers
      assert.isTrue(!domainMax.some(isNaN));
    });

    it("Test object data", function () {
      let dataPoints = lutObject.dataPoints;
      let size = lutObject.size;

      // ? Check type
      assert.isArray(dataPoints);
      // ? Check number of lines
      assert.equal(dataPoints.length, size);
      // ? Check if all lines have proper length
      assert.isTrue(
        dataPoints
          .map((point) => {
            return point.length === 3;
          })
          .every((e) => e === true)
      );
      // ? Check if all elements are numbers
      assert.isTrue(
        dataPoints
          .map((point) => {
            return point.some(isNaN);
          })
          .every((e) => e === false)
      );
    });
  });

  describe("3D Cube LUT", function () {
    let lutContent = fs.readFileSync("./test/3DLUT.cube");
    let lutObject = cubeLUT.parse(lutContent);

    it("Test object title", function () {
      let title = lutObject.title;

      // ? Check type
      assert.typeOf(title, "string");
      // ? Check value
      assert.equal(title, "3D Identity Cube LUT");
    });

    it("Test object type", function () {
      let type = lutObject.type;

      // ? Check type
      assert.typeOf(type, "string");
      // ? Check value
      assert.equal(type, "3D");
    });

    it("Test object size", function () {
      let size = lutObject.size;

      // ? Check type
      assert.typeOf(size, "number");
      assert.isTrue(Number.isInteger(size));
      // ? Check value
      assert.equal(size, 4);
    });

    it("Test object domain", function () {
      let domainMin = lutObject.domainMin;

      // ? Check type
      assert.isArray(domainMin);
      // ? Check value
      assert.deepEqual(domainMin, [0, 0, 0]);
      // ? Check length
      assert.equal(domainMin.length, 3);
      // ? Check if all elements are numbers
      assert.isTrue(!domainMin.some(isNaN));

      let domainMax = lutObject.domainMax;

      // ? Check type
      assert.isArray(domainMax);
      // ? Check value
      assert.deepEqual(domainMax, [1, 1, 1]);
      // ? Check length
      assert.equal(domainMax.length, 3);
      // ? Check if all elements are numbers
      assert.isTrue(!domainMax.some(isNaN));
    });

    it("Test object data", function () {
      let dataPoints = lutObject.dataPoints;
      let size = lutObject.size;

      // ? Check type
      assert.isArray(dataPoints);
      // ? Check number of lines
      assert.equal(dataPoints.length, Math.pow(size, 3));
      // ? Check if all lines have proper length
      assert.isTrue(
        dataPoints
          .map((point) => {
            return point.length === 3;
          })
          .every((e) => e === true)
      );
      // ? Check if all elements are numbers
      assert.isTrue(
        dataPoints
          .map((point) => {
            return point.some(isNaN);
          })
          .every((e) => e === false)
      );
    });
  });
});
