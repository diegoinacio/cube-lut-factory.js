const assert = require("chai").assert;
const cubeLUT = require("../index");

describe("Parse", function () {
  it("Test keyword case sensitive", function () {
    let lutContent = `
    # Comment
    TiTle "Title"
    lut_1D_SIZE 32
    `;

    let lutObject = {
      title: "Title",
      type: "1D",
      size: 32,
    };

    assert.deepEqual(cubeLUT.parse(lutContent), lutObject);
  });

  it("Test inappropriate tokens", function () {
    let lutContent = `
    # Comment
    TITLE "Title"
    LUT_1D_SIZE 32
    NO_EXIST 1
    `;

    let lutObject = {
      title: "Title",
      type: "1D",
      size: 32,
    };

    assert.deepEqual(cubeLUT.parse(lutContent), lutObject);
  });

  it("Test domain length", function () {
    let lutContent = `
    # Comment
    DOMAIN_MIN 0
    DOMAIN_MAX 1 2 3 4
    `;

    let lutObject = cubeLUT.parse(lutContent);

    assert.deepEqual(lutObject.domainMin, [0, 0, 0]);
    assert.deepEqual(lutObject.domainMax, [1, 2, 3]);
  });

  it("Test data point values", function () {
    let lutContent = `
    # Comment
    000 0 0    # Check left padding zero
    0.0 0 1    # Check float number
    .00 1 0    # Check float without integer part
    0 -1.0 1   # Check signed number
    1e-2 0 0   # Check exponent part
    a 0.0 0.0  # Ignore this line because it starts with invalid
    0.0 a 0.0  # Ignore this line because it has invalid value
    `;

    let lutObject1 = cubeLUT.parse(lutContent);
    let lutObject2 = {
      dataPoints: [
        [0, 0, 0],
        [0, 0, 1],
        [0, 1, 0],
        [0, -1, 1],
        [1e-2, 0, 0],
      ],
    };

    assert.deepEqual(lutObject1, lutObject2);
  });
});

describe("Generate", function () {
  it("Test empty header", function () {
    let lutObject = { title: "Test", type: "3D", size: 4 };
    let lutContent = cubeLUT.generate(lutObject).split("\n");

    assert.equal(
      lutContent[0],
      "# Cube LUT file generated with cube-lut-factory"
    );
    assert.equal(
      lutContent[1],
      "# https://github.com/diegoinacio/cube-lut-factory.js"
    );
  });

  it("Test custom header", function () {
    let lutObject = { title: "Test", type: "3D", size: 4 };
    lutObject.header = "First line of header\n";
    lutObject.header += "Second line of header\n";
    lutObject.header += "Third line of header";
    let lutContent = cubeLUT.generate(lutObject).split("\n");

    assert.equal(lutContent[0], "# First line of header");
    assert.equal(lutContent[1], "# Second line of header");
    assert.equal(lutContent[2], "# Third line of header");
  });

  it("Test mandatory properties", function () {
    let lutObject = { title: "Test", type: "3D", size: 4 };
    let lutContent = cubeLUT.generate(lutObject).split("\n");

    assert.equal(lutContent[2], `TITLE "Test"`);
    assert.equal(lutContent[5], "LUT_3D_SIZE 4");
  });

  it("Test domain", function () {
    let lutObject = { title: "Test", type: "3D", size: 4 };
    lutObject.domainMin = [0, 0, 0.5];
    lutObject.domainMax = [1, 1, 1];
    let lutContent = cubeLUT.generate(lutObject).split("\n");

    assert.equal(lutContent[8], "DOMAIN_MIN 0 0 0.5");
    assert.equal(lutContent[9], "DOMAIN_MAX 1 1 1");
  });

  it("Test data points", function () {
    let lutObject = { title: "Test", type: "1D", size: 5 };
    let lutContent = cubeLUT.generate(lutObject).split("\n");

    assert.equal(lutContent[12], "0 0 0");
    assert.equal(lutContent[13], "0.25 0.25 0.25");
    assert.equal(lutContent[14], "0.5 0.5 0.5");
    assert.equal(lutContent[15], "0.75 0.75 0.75");
    assert.equal(lutContent[16], "1 1 1");
  });

  it("Test data points", function () {
    let lutObject = { title: "Test", type: "3D", size: 2 };
    lutObject.R = "r + g + b";
    lutObject.B = "r * g * b";
    let lutContent = cubeLUT.generate(lutObject).split("\n");

    assert.equal(lutContent[12], "0 0 0");
    assert.equal(lutContent[13], "1 0 0");
    assert.equal(lutContent[14], "1 1 0");
    assert.equal(lutContent[15], "2 1 0");
    assert.equal(lutContent[16], "1 0 0");
    assert.equal(lutContent[17], "2 0 0");
    assert.equal(lutContent[18], "2 1 0");
    assert.equal(lutContent[19], "3 1 1");
  });
});
