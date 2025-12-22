import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeterService } from './meterdata.service';
import { MeterController } from './meterdata.controller';
import { MeterReading } from './meterdata.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MeterReading])],
  controllers: [MeterController],
  providers: [MeterService],
  exports: [MeterService],
})
export class MeterModule {}
