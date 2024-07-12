import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleDto {
  @ApiProperty()
  licensePlate: string;

  @ApiProperty()
  chassis: string;

  @ApiProperty()
  renavam: string;

  @ApiProperty()
  model: string;

  @ApiProperty()
  brand: string;

  @ApiProperty()
  year: string;
}
