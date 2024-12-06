import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Humidity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  humidity: string;

  @Column({ nullable: false })
  temperature: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  timestamp: string;
}
