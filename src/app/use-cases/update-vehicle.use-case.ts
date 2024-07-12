import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { VehicleRepository } from '../../domain/repositories/vehicle.repository';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';
import { Vehicle } from 'src/domain/entities/vehicle.entity';

@Injectable()
export class UpdateVehicleUseCase {
  constructor(private readonly vehicleRepository: VehicleRepository) {}

  async execute(
    id: string,
    updateVehicleDto: UpdateVehicleDto,
  ): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findById(id);

    if (!vehicle) {
      throw new HttpException('Vehicle not found', HttpStatus.NOT_FOUND);
    }

    // Atualiza os campos do veículo com os dados do DTO
    const updatedVehicle = {
      ...vehicle,
      ...updateVehicleDto,
    } as Vehicle;

    const result = await this.vehicleRepository.update(id, updatedVehicle);

    return result;
  }
}
