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

export class RightAscensionSexagesimal {
  hours: number;
  minutes: number;
  seconds: number;

  constructor(hours: number, minutes: number, seconds: number) {
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
  }
}

export class DeclinationSexagesimal {
  degrees: number;
  minutes: number;
  seconds: number;

  constructor(degrees: number, minutes: number, seconds: number) {
    this.degrees = degrees;
    this.minutes = minutes;
    this.seconds = seconds;
  }
}

export class Exoplanet {
  pl_name: string;
  hostname: string;
  ra: number;
  dec: number;
  sy_dist: number;

  constructor(
    pl_name: string,
    hostname: string,
    ra: number,
    dec: number,
    sy_dist: number
  ) {
    this.pl_name = pl_name;
    this.hostname = hostname;
    this.ra = ra;
    this.dec = dec;
    this.sy_dist = sy_dist;
  }
}
