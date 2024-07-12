import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { Vehicle } from 'src/domain/entities/vehicle.entity';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';
import { CreateVehicleUseCase } from '../use-cases/create-vehicle.use-case';
import { FindAllVehiclesUseCase } from '../use-cases/find-all-vehicles.use-case';
import { FindOneVehicleUseCase } from '../use-cases/find-one-vehicle.use-case';
import { UpdateVehicleUseCase } from '../use-cases/update-vehicle.use-case';
import { DeleteVehicleUseCase } from '../use-cases/delete-vehicle.use-case';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('vehicles')
@Controller('vehicles')
export class VehicleController {
  constructor(
    private readonly _CreateVehicleUseCase: CreateVehicleUseCase,
    private readonly _FindAllVehiclesUseCase: FindAllVehiclesUseCase,
    private readonly _FindOneVehicleUseCase: FindOneVehicleUseCase,
    private readonly _UpdateVehicleUseCase: UpdateVehicleUseCase,
    private readonly _DeleteVehicleUseCase: DeleteVehicleUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a vehicle' })
  @ApiResponse({ status: 201, description: 'Vehicle created successfully.' })
  create(@Body() createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    return this._CreateVehicleUseCase.execute(createVehicleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vehicles' })
  @ApiResponse({ status: 200, description: 'Return all vehicles.' })
  findAll(): Promise<Vehicle[]> {
    return this._FindAllVehiclesUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a vehicle by ID' })
  @ApiResponse({ status: 200, description: 'Return a vehicle.' })
  findOne(@Param('id') id: string): Promise<Vehicle> {
    return this._FindOneVehicleUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a vehicle' })
  @ApiResponse({ status: 200, description: 'Vehicle updated successfully.' })
  update(
    @Param('id') id: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ): Promise<Vehicle> {
    return this._UpdateVehicleUseCase.execute(id, updateVehicleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a vehicle' })
  @ApiResponse({ status: 200, description: 'Vehicle deleted successfully.' })
  remove(@Param('id') id: string): Promise<void> {
    return this._DeleteVehicleUseCase.execute(id);
  }
}
