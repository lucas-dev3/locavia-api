import { Test, TestingModule } from '@nestjs/testing';
import { VehicleController } from './vehicle.controller';
import { CreateVehicleUseCase } from '../use-cases/create-vehicle.use-case';
import { FindAllVehiclesUseCase } from '../use-cases/find-all-vehicles.use-case';
import { FindOneVehicleUseCase } from '../use-cases/find-one-vehicle.use-case';
import { UpdateVehicleUseCase } from '../use-cases/update-vehicle.use-case';
import { DeleteVehicleUseCase } from '../use-cases/delete-vehicle.use-case';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { Vehicle } from '../../domain/entities/vehicle.entity';
import { randomUUID } from 'crypto';
import { VehicleRepositoryService } from '../../infra/persistense/vehicle/vehicle.repository.impl';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleEntity } from '../../infra/persistense/vehicle/vehicle.entity';
import { VehicleRepository } from '../../domain/repositories/vehicle.repository';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';

class MockVehicle extends Vehicle {
  constructor(
    id: string,
    licensePlate: string,
    chassis: string,
    renavam: string,
    model: string,
    brand: string,
    year: string,
  ) {
    super(id, licensePlate, chassis, renavam, model, brand, year);
  }
}

describe('VehicleController', () => {
  let controller: VehicleController;
  let createVehicleUseCase: CreateVehicleUseCase;
  let findAllVehiclesUseCase: FindAllVehiclesUseCase;
  let findOneVehicleUseCase: FindOneVehicleUseCase;
  let updateVehicleUseCase: UpdateVehicleUseCase;
  let deleteVehicleUseCase: DeleteVehicleUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'data/db.sqlite3',
          entities: [VehicleEntity],
          synchronize: true,
          logging: false,
        }),
        TypeOrmModule.forFeature([VehicleEntity]),
      ],
      controllers: [VehicleController],
      providers: [
        {
          provide: VehicleRepository, // Nome do provider conforme usado na aplicação
          useClass: VehicleRepositoryService, // Implementação do repository
        },
        CreateVehicleUseCase,
        FindAllVehiclesUseCase,
        FindOneVehicleUseCase,
        UpdateVehicleUseCase,
        DeleteVehicleUseCase,
      ],
    }).compile();

    controller = module.get<VehicleController>(VehicleController);
    createVehicleUseCase =
      module.get<CreateVehicleUseCase>(CreateVehicleUseCase);
    findAllVehiclesUseCase = module.get<FindAllVehiclesUseCase>(
      FindAllVehiclesUseCase,
    );
    findOneVehicleUseCase = module.get<FindOneVehicleUseCase>(
      FindOneVehicleUseCase,
    );
    updateVehicleUseCase =
      module.get<UpdateVehicleUseCase>(UpdateVehicleUseCase);
    deleteVehicleUseCase =
      module.get<DeleteVehicleUseCase>(DeleteVehicleUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a vehicle', async () => {
      const createVehicleDto: CreateVehicleDto = {
        model: 'SW4',
        year: '2023',
        brand: 'Toyota',
        chassis: '123456789',
        licensePlate: 'ABC1234',
        renavam: '12345678998',
      };

      const createdVehicle: Vehicle = new MockVehicle(
        randomUUID(),
        createVehicleDto.licensePlate,
        createVehicleDto.chassis,
        createVehicleDto.renavam,
        createVehicleDto.model,
        createVehicleDto.brand,
        createVehicleDto.year,
      );

      jest
        .spyOn(createVehicleUseCase, 'execute')
        .mockResolvedValue(createdVehicle);

      const result = await controller.create(createVehicleDto);
      expect(result).toBe(createdVehicle);
    });

    it('should handle a vehicle creation with invalid renavam (less than 11 digits)', async () => {
      const createVehicleDto: CreateVehicleDto = {
        model: 'SW4',
        year: '2023',
        brand: 'Toyota',
        chassis: '123456789',
        licensePlate: 'ABC1234',
        renavam: '1234567899', // Renavam com menos de 11 dígitos
      };

      jest.spyOn(createVehicleUseCase, 'execute').mockImplementation(() => {
        throw new HttpException(
          'Invalid RENAVAM. It should be an 11-digit number.',
          HttpStatus.BAD_REQUEST,
        );
      });

      try {
        await controller.create(createVehicleDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe(
          'Invalid RENAVAM. It should be an 11-digit number.',
        );
        expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should handle a vehicle creation with invalid license plate', async () => {
      const createVehicleDto: CreateVehicleDto = {
        model: 'SW4',
        year: '2023',
        brand: 'Toyota',
        chassis: '123456789',
        licensePlate: '12345', // Placa com formato inválido
        renavam: '12345678998',
      };

      jest.spyOn(createVehicleUseCase, 'execute').mockImplementation(() => {
        throw new HttpException(
          'Invalid license plate',
          HttpStatus.BAD_REQUEST,
        );
      });

      try {
        await controller.create(createVehicleDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Invalid license plate');
        expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    // Testa a criação de um veículo com dados duplicados
    it('should handle suspected fraud when multiple vehicles with same details exist', async () => {
      const createVehicleDto: CreateVehicleDto = {
        model: 'SW4',
        year: '2023',
        brand: 'Toyota',
        chassis: '123456789',
        licensePlate: 'ABC1234',
        renavam: '12345678998',
      };
  
      const existingVehicles: Vehicle[] = [
        new MockVehicle(
          randomUUID(),
          createVehicleDto.licensePlate,
          createVehicleDto.chassis,
          createVehicleDto.renavam,
          createVehicleDto.model,
          createVehicleDto.brand,
          createVehicleDto.year,
        ),
        new MockVehicle(
          randomUUID(),
          createVehicleDto.licensePlate,
          createVehicleDto.chassis,
          createVehicleDto.renavam,
          createVehicleDto.model,
          createVehicleDto.brand,
          createVehicleDto.year,
        ),
      ];
  
      jest.spyOn(createVehicleUseCase, 'execute').mockImplementation(async () => {
        if (existingVehicles.length > 1) {
          throw new HttpException(
            'Suspeita de fraude detectada: há mais de um veículo com os mesmos dados de RENAVAM, chassi ou placa.',
            HttpStatus.CONFLICT,
          );
        }
        return existingVehicles[0];
      });
  
      try {
        await controller.create(createVehicleDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe(
          'Suspeita de fraude detectada: há mais de um veículo com os mesmos dados de RENAVAM, chassi ou placa.',
        );
        expect(error.getStatus()).toBe(HttpStatus.CONFLICT);
      }
    });

    it('should handle existing vehicle with same details', async () => {
      const createVehicleDto: CreateVehicleDto = {
        model: 'SW4',
        year: '2023',
        brand: 'Toyota',
        chassis: '123456789',
        licensePlate: 'ABC1234',
        renavam: '12345678998',
      };
  
      const existingVehicle: Vehicle = new MockVehicle(
        randomUUID(),
        createVehicleDto.licensePlate,
        createVehicleDto.chassis,
        createVehicleDto.renavam,
        createVehicleDto.model,
        createVehicleDto.brand,
        createVehicleDto.year,
      );
  
      jest.spyOn(createVehicleUseCase, 'execute').mockImplementation(async () => {
        const vehicleAlreadyExists = [existingVehicle];
        if (vehicleAlreadyExists.length === 1) {
          throw new HttpException(
            'Já existe outro veículo com o mesmo RENAVAM, chassi ou placa.',
            HttpStatus.CONFLICT,
          );
        }
        return existingVehicle;
      });
  
      try {
        await controller.create(createVehicleDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe(
          'Já existe outro veículo com o mesmo RENAVAM, chassi ou placa.',
        );
        expect(error.getStatus()).toBe(HttpStatus.CONFLICT);
      }
    });
  });

  describe('findAll', () => {
    it('should return all vehicles', async () => {
      const vehicles: Vehicle[] = [
        // Defina os veículos de exemplo conforme necessário
        new Vehicle(
          '1',
          'ABC1234',
          '123456789',
          '12345678998',
          'SW4',
          'Toyota',
          '2023',
        ),
        new Vehicle(
          '2',
          'DEF5678',
          '987654321',
          '98765432109',
          'Corolla',
          'Toyota',
          '2022',
        ),
      ];

      jest.spyOn(findAllVehiclesUseCase, 'execute').mockResolvedValue(vehicles);

      const result = await controller.findAll();
      expect(result).toBe(vehicles);
    });

    it('should handle errors from findAll use case', async () => {
      jest.spyOn(findAllVehiclesUseCase, 'execute').mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      try {
        await controller.findAll();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Unexpected error');
      }
    });

    it('should return an empty array if no vehicles are found', async () => {
      const emptyVehicles: Vehicle[] = [];

      jest
        .spyOn(findAllVehiclesUseCase, 'execute')
        .mockResolvedValue(emptyVehicles);

      const result = await controller.findAll();
      expect(result).toEqual(emptyVehicles);
    });

    it('should handle errors from findAll use case', async () => {
      jest.spyOn(findAllVehiclesUseCase, 'execute').mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      try {
        await controller.findAll();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Unexpected error');
      }
    });
  });

  describe('findOne', () => {
    it('should return a vehicle by ID', async () => {
      const vehicleId = '1';
      const vehicle: Vehicle = new MockVehicle(
        randomUUID(),
        'ABC1234',
        '123456789',
        '12345678998',
        'SW4',
        'Toyota',
        '2023',
      );

      jest.spyOn(findOneVehicleUseCase, 'execute').mockResolvedValue(vehicle);

      const result = await controller.findOne(vehicleId);
      expect(result).toEqual(vehicle);
    });

    it('should handle vehicle not found', async () => {
      const vehicleId = '1';

      jest.spyOn(findOneVehicleUseCase, 'execute').mockResolvedValue(null);

      try {
        await controller.findOne(vehicleId);
      } catch (error) {
        expect(error.status).toBe(404);
        expect(error.message).toBe('Vehicle not found');
      }
    });

    it('should handle errors from findOne use case', async () => {
      const vehicleId = '1';

      jest.spyOn(findOneVehicleUseCase, 'execute').mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      try {
        await controller.findOne(vehicleId);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Unexpected error');
      }
    });
  });

  describe('update', () => {
    it('should update a vehicle', async () => {
      const vehicleId = randomUUID();
      const updateVehicleDto: UpdateVehicleDto = {
        model: 'Corolla',
        year: '2024',
        brand: 'Toyota',
        chassis: '987654321',
        licensePlate: 'XYZ9876',
        renavam: '98765432100',
      };

      const updatedVehicle = {
        id: vehicleId,
        ...updateVehicleDto,
      } as Vehicle;

      jest
        .spyOn(updateVehicleUseCase, 'execute')
        .mockResolvedValue(updatedVehicle);

      const result = await controller.update(vehicleId, updateVehicleDto);
      expect(result).toEqual(updatedVehicle);
    });

    it('should handle a vehicle update with invalid renavam (less than 11 digits)', async () => {
      const vehicleId = randomUUID();
      const updateVehicleDto: UpdateVehicleDto = {
        model: 'Corolla',
        year: '2024',
        brand: 'Toyota',
        chassis: '987654321',
        licensePlate: 'XYZ9876',
        renavam: '9876543210', // Renavam com menos de 11 dígitos
      };

      jest.spyOn(updateVehicleUseCase, 'execute').mockImplementation(() => {
        throw new HttpException(
          'Invalid RENAVAM. It should be an 11-digit number.',
          HttpStatus.BAD_REQUEST,
        );
      });

      try {
        await controller.update(vehicleId, updateVehicleDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe(
          'Invalid RENAVAM. It should be an 11-digit number.',
        );
        expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should handle a vehicle update with invalid license plate', async () => {
      const vehicleId = randomUUID();
      const updateVehicleDto: UpdateVehicleDto = {
        model: 'Corolla',
        year: '2024',
        brand: 'Toyota',
        chassis: '987654321',
        licensePlate: 'XYZ987', // Placa com formato inválido
        renavam: '98765432100',
      };

      jest.spyOn(updateVehicleUseCase, 'execute').mockImplementation(() => {
        throw new HttpException(
          'Invalid license plate',
          HttpStatus.BAD_REQUEST,
        );
      });

      try {
        await controller.update(vehicleId, updateVehicleDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Invalid license plate');
        expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should handle vehicle not found', async () => {
      const vehicleId = '1';
      const updateVehicleDto: UpdateVehicleDto = {
        model: 'Corolla',
        year: '2024',
        brand: 'Toyota',
        chassis: '987654321',
        licensePlate: 'XYZ9876',
        renavam: '98765432100',
      };

      jest.spyOn(updateVehicleUseCase, 'execute').mockResolvedValue(null);

      try {
        await controller.update(vehicleId, updateVehicleDto);
      } catch (error) {
        expect(error.status).toBe(404);
        expect(error.message).toBe('Vehicle not found');
      }
    });

    it('should handle errors from update use case', async () => {
      const vehicleId = '1';
      const updateVehicleDto: UpdateVehicleDto = {
        model: 'Corolla',
        year: '2024',
        brand: 'Toyota',
        chassis: '987654321',
        licensePlate: 'XYZ9876',
        renavam: '98765432100',
      };

      jest.spyOn(updateVehicleUseCase, 'execute').mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      try {
        await controller.update(vehicleId, updateVehicleDto);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Unexpected error');
      }
    });
  });

  describe('delete', () => {
    it('should delete a vehicle', async () => {
      const vehicleId = '1';
  
      jest.spyOn(deleteVehicleUseCase, 'execute').mockResolvedValue(undefined);
  
      const result = await controller.remove(vehicleId);
      expect(result).toBeUndefined();
      expect(deleteVehicleUseCase.execute).toHaveBeenCalledWith(vehicleId);
    });

    it('should handle vehicle not found', async () => {
      const vehicleId = '1';

      jest.spyOn(deleteVehicleUseCase, 'execute').mockResolvedValue();

      try {
        await controller.remove(vehicleId);
      } catch (error) {
        expect(error.status).toBe(404);
        expect(error.message).toBe('Vehicle not found');
      }
    });

    it('should handle errors from delete use case', async () => {
      const vehicleId = '1';

      jest.spyOn(deleteVehicleUseCase, 'execute').mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      try {
        await controller.remove(vehicleId);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Unexpected error');
      }
    });
  });
});
