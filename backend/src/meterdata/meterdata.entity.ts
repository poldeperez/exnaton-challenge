import { Entity, Column, PrimaryGeneratedColumn, Index, Unique } from 'typeorm';

@Entity('meter_readings')
@Index(['tenantId', 'installationId', 'meterId', 'timestamp'])
@Unique(['tenantId', 'meterId', 'timestamp'])
export class MeterReading {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @Column()
  installationId: string;

  @Column()
  meterId: string;

  @Column()
  obisCode: string;

  @Column({ type: 'timestamptz' })
  timestamp: Date;

  @Column('float')
  value: number;

  @Column()
  quality: string;
}
