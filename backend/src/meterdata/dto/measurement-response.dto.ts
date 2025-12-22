import { ApiProperty } from '@nestjs/swagger';

export class MeasurementDataDto {
  @ApiProperty({
    description: 'Measurement type',
    example: 'energy',
  })
  measurement: string;

  @ApiProperty({
    description: 'Timestamp of measurement',
    example: '2023-02-01T00:00:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Solar energy production value in kWh',
    example: 12.5,
  })
  solar_value: number;

  @ApiProperty({
    description: 'Energy consumption value in kWh',
    example: 8.3,
  })
  consumption_value: number;

  @ApiProperty({
    description: 'Self-consumed energy value in kWh',
    example: 8.3,
  })
  self_consumption: number;
}

export class MeasurementResponseDto {
  @ApiProperty({
    description: 'Array of measurement data points',
    type: [MeasurementDataDto],
  })
  data: MeasurementDataDto[];
}