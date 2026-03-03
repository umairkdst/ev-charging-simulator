import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { SimulationParameters } from "./SimulationParameters";

export type HourlyRow = { hour: number; power: number; activeStations: number };
export type CpRow = {
  stationId: number;
  averagePower: number;
  peakPower: number;
  utilization: number;
};
@Entity()
export class SimulationResults {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => SimulationParameters, {
    nullable: false,
    onDelete: "CASCADE",
  })
  parameters!: SimulationParameters;

  @Column({ type: "float" })
  totalEnergyCharged!: number;

  @Column({ type: "float" })
  peakPower!: number;

  @Column({ type: "float" })
  concurrencyFactor!: number;

  @Column("simple-json")
  exemplaryDay!: HourlyRow[];

  @Column("simple-json")
  chargepointPower!: CpRow[];
  @Column({ type: "int" })
  chargingEventsYear!: number;

  @Column({ type: "int" })
  chargingEventsMonth!: number;

  @Column({ type: "int" })
  chargingEventsWeek!: number;

  @Column({ type: "int" })
  chargingEventsDay!: number;
}
