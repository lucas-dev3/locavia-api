import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class VehicleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  licensePlate: string;

  @Column()
  chassis: string;

  @Column()
  renavam: string;

  @Column()
  model: string;

  @Column()
  brand: string;

  @Column()
  year: string;
}
