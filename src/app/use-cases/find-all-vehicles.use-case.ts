import { Injectable } from "@nestjs/common";
import { Vehicle } from "../../domain/entities/vehicle.entity";
import { VehicleRepository } from "../../domain/repositories/vehicle.repository";

@Injectable()
export class FindAllVehiclesUseCase {
  constructor(private readonly vehicleRepository: VehicleRepository) {}

  async execute(): Promise<Vehicle[]> {
    return this.vehicleRepository.findAll();
  }
}