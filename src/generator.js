"use strict";

const colors = require("./colors");
const { evaluate } = require("mathjs");

function UserException(message) {
  this.name = "UserException";
  this.message = message;
}

function vectorization(element) {
  if (element.constructor === Array) {
    return element.length === 3
      ? element.slice(0, 3)
      : Array(3).fill(Number(element[0]));
  }

  return Array(3).fill(Number(element));
}

function generateLUT(lutObject) {
  // Generate lut file content from lut object
  let lutContent = "";

  if ("header" in lutObject) {
    const header = lutObject.header.toString();
    const lines = header.split("\n");
    lines.forEach((line) => {
      let trimmed = line.trim();
      lutContent += `# ${trimmed}\n`;
    });
  } else {
    lutContent += "# Cube LUT file generated with cube-lut-factory\n";
    lutContent += "# https://github.com/diegoinacio/cube-lut-factory.js\n";
  }

  if (!("title" in lutObject)) {
    throw new UserException(
      `${colors.FgRed}Cube LUT object must have a ${colors.FgYellow}title${colors.Reset}`
    );
  } else {
    lutContent += `TITLE "${lutObject.title}"\n`;
  }

  lutContent += "\n# Cube LUT size\n";

  if (!("type" in lutObject)) {
    throw new UserException(
      `${colors.FgRed}Cube LUT object must have a ${colors.FgYellow}type${colors.Reset}`
    );
  } else {
    let types = ["1D", "3D"];
    if (!types.includes(lutObject.type))
      throw new UserException(
        `${colors.FgRed}Cube LUT object type must be ${colors.FgGreen}1D | 3D${colors.Reset}`
      );
    lutContent += `LUT_${lutObject.type}_SIZE `;
  }

  if (!("size" in lutObject)) {
    throw new UserException(
      `${colors.FgRed}Cube LUT object must have a ${colors.FgYellow}size.${colors.Reset}`
    );
  } else {
    lutContent += `${lutObject.size}\n`;
  }

  lutContent += "\n# Cube LUT domain\n";

  if ("domainMin" in lutObject) {
    lutObject.domainMin = vectorization(lutObject.domainMin);
    let r = lutObject.domainMin[0];
    let g = lutObject.domainMin[1];
    let b = lutObject.domainMin[2];
    lutContent += `DOMAIN_MIN ${r} ${g} ${b}\n`;
  } else {
    lutObject.domainMin = [0, 0, 0];
    lutContent += `DOMAIN_MIN 0 0 0\n`;
  }

  if ("domainMax" in lutObject) {
    lutObject.domainMax = vectorization(lutObject.domainMax);
    let r = lutObject.domainMax[0];
    let g = lutObject.domainMax[1];
    let b = lutObject.domainMax[2];
    lutContent += `DOMAIN_MAX ${r} ${g} ${b}\n`;
  } else {
    lutObject.domainMax = [1, 1, 1];
    lutContent += `DOMAIN_MAX 0 0 0\n`;
  }

  lutContent += "\n# Cube LUT data points\n";

  if (lutObject.type == "1D") {
    let dMin = lutObject.domainMin;
    let dMax = lutObject.domainMax;
    lutObject.R = "R" in lutObject ? lutObject.R : "t";
    lutObject.G = "G" in lutObject ? lutObject.G : "t";
    lutObject.B = "B" in lutObject ? lutObject.B : "t";
    for (let i = 0; i < lutObject.size; i++) {
      let t = i / (lutObject.size - 1);
      let r = dMin[0] + t * dMax[0];
      let g = dMin[1] + t * dMax[1];
      let b = dMin[2] + t * dMax[2];
      let evalR = evaluate(lutObject.R, { t: r });
      let evalG = evaluate(lutObject.G, { t: g });
      let evalB = evaluate(lutObject.B, { t: b });
      lutContent += `${evalR} ${evalG} ${evalB}\n`;
    }
  }

  if (lutObject.type == "3D") {
    let dMin = lutObject.domainMin;
    let dMax = lutObject.domainMax;
    lutObject.R = "R" in lutObject ? lutObject.R : "r";
    lutObject.G = "G" in lutObject ? lutObject.G : "g";
    lutObject.B = "B" in lutObject ? lutObject.B : "b";
    for (let k = 0; k < lutObject.size; k++) {
      for (let j = 0; j < lutObject.size; j++) {
        for (let i = 0; i < lutObject.size; i++) {
          let tr = i / (lutObject.size - 1);
          let tg = j / (lutObject.size - 1);
          let tb = k / (lutObject.size - 1);
          let r = dMin[0] + tr * dMax[0];
          let g = dMin[1] + tg * dMax[1];
          let b = dMin[2] + tb * dMax[2];
          let evalR = evaluate(lutObject.R, { r, g, b });
          let evalG = evaluate(lutObject.G, { r, g, b });
          let evalB = evaluate(lutObject.B, { r, g, b });
          lutContent += `${evalR} ${evalG} ${evalB}\n`;
        }
      }
    }
  }

  return lutContent;
}

module.exports = generateLUT;
