import { HttpException, HttpStatus } from '@nestjs/common';

export class Vehicle {
  id: string;
  licensePlate: string;
  chassis: string;
  renavam: string;
  model: string;
  brand: string;
  year: string;

  constructor(
    id: string,
    licensePlate: string,
    chassis: string,
    renavam: string,
    model: string,
    brand: string,
    year: string,
  ) {
    this.id = id;
    this.licensePlate = licensePlate;
    this.chassis = chassis;
    this.renavam = renavam;
    this.model = model;
    this.brand = brand;
    this.year = year;

    this.validateLicensePlate();
    this.validateRenavam();
  }

  // License plate validation method
  private validateLicensePlate() {
    const licensePlateRegex = /^[A-Z]{3}[0-9][0-9A-Z][0-9]{2}$/;
    if (!licensePlateRegex.test(this.licensePlate)) {
      throw new HttpException('Invalid license plate', HttpStatus.BAD_REQUEST);
    }
  }

  // RENAVAM validation method
  private validateRenavam() {
    const renavamRegex = /^\d{11}$/;
    if (!renavamRegex.test(this.renavam)) {
      throw new HttpException(
        'Invalid RENAVAM. It should be an 11-digit number.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
