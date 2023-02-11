export class CartesianCoordinates {
  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

export class RightAscension {
  hours: number;
  minutes: number;
  seconds: number;

  constructor(hours: number, minutes: number, seconds: number) {
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
  }
}

export class Declination {
  degrees: number;
  minutes: number;
  seconds: number;

  constructor(degrees: number, minutes: number, seconds: number) {
    this.degrees = degrees;
    this.minutes = minutes;
    this.seconds = seconds;
  }
}
