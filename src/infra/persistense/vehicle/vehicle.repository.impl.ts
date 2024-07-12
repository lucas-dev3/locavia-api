import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from '../../../domain/entities/vehicle.entity';
import { VehicleRepository } from '../../../domain/repositories/vehicle.repository';
import { Repository } from 'typeorm';
import { VehicleEntity } from './vehicle.entity';

@Injectable()
export class VehicleRepositoryService implements VehicleRepository {
  constructor(
    @InjectRepository(VehicleEntity)
    private vehicleRepository: Repository<VehicleEntity>,
  ) {}

  async findByFilter(options: {
    chassis?: string;
    renavam?: string;
    licensePlate?: string;
  }): Promise<Vehicle[]> {
    const vehicles = await this.vehicleRepository.find({
      where: options,
    });

    return vehicles.map((vehicle) => {
      return new Vehicle(
        vehicle.id,
        vehicle.licensePlate,
        vehicle.chassis,
        vehicle.renavam,
        vehicle.model,
        vehicle.brand,
        vehicle.year,
      );
    });
  }

  async findAll(): Promise<Vehicle[]> {
    const vehicles = await this.vehicleRepository.find();

    return vehicles.map((vehicle) => {
      return new Vehicle(
        vehicle.id,
        vehicle.licensePlate,
        vehicle.chassis,
        vehicle.renavam,
        vehicle.model,
        vehicle.brand,
        vehicle.year,
      );
    });
  }

  async findById(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({ where: { id } });

    if (!vehicle) {
      return null;
    }

    return new Vehicle(
      vehicle.id,
      vehicle.licensePlate,
      vehicle.chassis,
      vehicle.renavam,
      vehicle.model,
      vehicle.brand,
      vehicle.year,
    );
  }

  async create(vehicle: Vehicle): Promise<Vehicle> {
    return await this.vehicleRepository.save(vehicle);
  }

  async update(id: string, vehicle: Vehicle): Promise<Vehicle> {
    return await this.vehicleRepository.update(id, vehicle).then(() => vehicle);
  }

  async delete(id: string): Promise<void> {
    this.vehicleRepository.delete(id);
  }
}
