import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class SimulationParameters {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int" })
  chargePoints!: number;

  @Column({ type: "float", default: 100 })
  arrivalMultiplier!: number;

  @Column({ type: "float", default: 18 })
  carConsumption!: number;

  @Column({ type: "float", default: 11 })
  chargingPower!: number;
}
