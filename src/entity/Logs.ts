import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Logs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "float", nullable: false })
  water_level: string;

  @Column()
  sensor_no: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  timestamp: string;
}
