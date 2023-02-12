import {
  CartesianCoordinates,
  RightAscensionSexagesimal,
  DeclinationSexagesimal,
} from './types';

export function toRadians(degrees: number): number {
  var pi = Math.PI;
  return degrees * (pi / 180);
}

export function convertAstronomicalDegreesToCartesian(
  rightAscensionDegrees: number,
  declinationDegrees: number,
  distance: number // can be either light years or parsecs
) {
  let x =
    distance *
    Math.cos(toRadians(declinationDegrees)) *
    Math.cos(toRadians(rightAscensionDegrees));
  let y =
    distance *
    Math.cos(toRadians(declinationDegrees)) *
    Math.sin(toRadians(rightAscensionDegrees));
  let z = distance * Math.sin(toRadians(declinationDegrees));

  let coords = new CartesianCoordinates(x, y, z);

  return coords;
}

// Math for this explained here http://fmwriters.com/Visionback/Issue14/wbputtingstars.htm
export function convertAstronomicalSexagesimalToCartesian(
  rightAscension: RightAscensionSexagesimal,
  declination: DeclinationSexagesimal,
  distance: number // can be either light years or parsecs
): CartesianCoordinates {
  let rightAscensionDegrees =
    convertRightAscensionSexagesimalToDegrees(rightAscension);
  let declinationDegrees = convertDeclinationSexagesimalToDegrees(declination);

  return convertAstronomicalDegreesToCartesian(
    rightAscensionDegrees,
    declinationDegrees,
    distance
  );
}

export function convertRightAscensionSexagesimalToDegrees(
  rightAscension: RightAscensionSexagesimal
): number {
  return (
    rightAscension.hours * 15 +
    rightAscension.minutes * 0.25 +
    rightAscension.seconds * 0.004166
  );
}

export function convertDeclinationSexagesimalToDegrees(
  declination: DeclinationSexagesimal
): number {
  return (
    (Math.abs(declination.degrees) +
      declination.minutes / 60 +
      declination.seconds / 3600) *
    Math.sign(declination.degrees)
  );
}
