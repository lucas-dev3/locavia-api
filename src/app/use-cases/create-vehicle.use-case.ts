import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Vehicle } from '../../domain/entities/vehicle.entity';
import { VehicleRepository } from '../../domain/repositories/vehicle.repository';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class CreateVehicleUseCase {
  constructor(private readonly vehicleRepository: VehicleRepository) {}

  async execute(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    const { brand, year, model, ...remainder } = createVehicleDto;

    const vehicleAlreadyExists =
      await this.vehicleRepository.findByFilter(remainder);

    if (vehicleAlreadyExists.length > 1) {
      throw new HttpException(
        'Suspeita de fraude detectada: há mais de um veículo com os mesmos dados de RENAVAM, chassi ou placa.',
        HttpStatus.CONFLICT,
      );
    } else if (vehicleAlreadyExists.length === 1) {
      throw new HttpException(
        'Já existe outro veículo com o mesmo RENAVAM, chassi ou placa.',
        HttpStatus.CONFLICT,
      );
    }

    const vehicle = new Vehicle(
      randomUUID(),
      createVehicleDto.licensePlate,
      createVehicleDto.chassis,
      createVehicleDto.renavam,
      createVehicleDto.model,
      createVehicleDto.brand,
      createVehicleDto.year,
    );
    return this.vehicleRepository.create(vehicle);
  }
}
