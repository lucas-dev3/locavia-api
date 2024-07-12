import { Vehicle } from '../entities/vehicle.entity';

/**
 * Represents an abstract class for a vehicle repository.
 */
export abstract class VehicleRepository {
  abstract findAll(): Promise<Vehicle[]>;
  abstract findById(id: string): Promise<Vehicle>;
  abstract findByFilter(options: VehicleFilter): Promise<Vehicle[]>;
  abstract create(vehicle: Vehicle): Promise<Vehicle>;
  abstract update(id: string, vehicle: Vehicle): Promise<Vehicle>;
  abstract delete(id: string): Promise<void>;
}

// input
type VehicleFilter = {
  chassis?: String;
  renavam?: String;
  licensePlate?: String;
};
