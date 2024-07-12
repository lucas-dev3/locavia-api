import { Injectable } from "@nestjs/common";
import { VehicleRepository } from "../../domain/repositories/vehicle.repository";

@Injectable()
export class DeleteVehicleUseCase {
  constructor(private readonly vehicleRepository: VehicleRepository) {}

  async execute(id: string): Promise<void> {
    return this.vehicleRepository.delete(id);
  }
}