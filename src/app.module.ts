import { Module } from '@nestjs/common';
import { VehicleController } from './app/controllers/vehicle.controller';
import { VehicleRepositoryService } from './infra/persistense/vehicle/vehicle.repository.impl';
import { VehicleRepository } from './domain/repositories/vehicle.repository';
import { CreateVehicleUseCase } from './app/use-cases/create-vehicle.use-case';
import { UpdateVehicleUseCase } from './app/use-cases/update-vehicle.use-case';
import { FindAllVehiclesUseCase } from './app/use-cases/find-all-vehicles.use-case';
import { FindOneVehicleUseCase } from './app/use-cases/find-one-vehicle.use-case';
import { DeleteVehicleUseCase } from './app/use-cases/delete-vehicle.use-case';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleEntity } from './infra/persistense/vehicle/vehicle.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data/db.sqlite3',
      entities: [VehicleEntity], // Liste todas as suas entidades aqui
      synchronize: true,
      logging: false,
    }),
    TypeOrmModule.forFeature([VehicleEntity]),
  ],
  controllers: [VehicleController],
  providers: [
    {
      provide: VehicleRepository,
      useClass: VehicleRepositoryService,
    },
    CreateVehicleUseCase,
    UpdateVehicleUseCase,
    FindAllVehiclesUseCase,
    FindOneVehicleUseCase,
    DeleteVehicleUseCase,
  ],
})
export class AppModule {}
