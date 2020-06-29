"use strict";

function removeComments(string) {
  return string.replace(/(?=\#).*/, "");
}

function removeQuotes(string) {
  return string.replace(/['"]+/g, "");
}

function isNumber(string) {
  return /^(?=.)([+-]?([0-9]*)(\.[0-9]*)?([eE][+-]?[0-9]*)?)$/.test(string);
}

function someNaN(array) {
  return array
    .map((value) => {
      return isNumber(value);
    })
    .some((e) => e === false);
}

function parseLUT(lutContent) {
  // Parse lut file content to lut object
  lutContent = lutContent.toString();

  let lutObject = {};

  const lines = lutContent.split("\n");

  lines.forEach((line) => {
    let no_comment = removeComments(line);
    let trimmed = no_comment.trim();
    let elements = trimmed.split(/\s+/);

    let head = elements[0].toUpperCase();
    let tail = elements.slice(1);
    switch (true) {
      case head === "TITLE":
        lutObject.title = removeQuotes(tail.join(" "));
        break;

      case head === "LUT_1D_SIZE":
        lutObject.type = "1D";
        lutObject.size = parseInt(tail[0]);
        break;

      case head === "LUT_3D_SIZE":
        lutObject.type = "3D";
        lutObject.size = parseInt(tail[0]);
        break;

      case head === "DOMAIN_MIN":
        let valuesMin = tail.map(Number);
        if (valuesMin.length >= 3) {
          lutObject.domainMin = valuesMin.slice(0, 3);
        } else {
          lutObject.domainMin = Array(3).fill(valuesMin[0]);
        }
        break;

      case head === "DOMAIN_MAX":
        let valuesMax = tail.map(Number);
        if (valuesMax.length >= 3) {
          lutObject.domainMax = valuesMax.slice(0, 3);
        } else {
          lutObject.domainMax = Array(3).fill(valuesMax[0]);
        }
        break;

      case isNumber(head):
        if (!("dataPoints" in lutObject)) lutObject.dataPoints = [];
        if (someNaN(elements)) return;
        lutObject.dataPoints.push(elements.map(Number));
        break;

      default:
        break;
    }
  });

  return lutObject;
}

module.exports = parseLUT;
