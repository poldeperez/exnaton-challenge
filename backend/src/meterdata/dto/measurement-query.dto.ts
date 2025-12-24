import { ApiProperty } from '@nestjs/swagger';

export class MeasurementQueryDto {
  @ApiProperty({
    description: 'Solar meter ID',
    example: 'meter-solar-123',
  })
  solarMeterId: string;

  @ApiProperty({
    description: 'Solar meter OBIS code',
    example: '0100021D00FF',
  })
  solarObisCode: string;

  @ApiProperty({
    description: 'Consumption meter ID',
    example: 'meter-consumption-456',
  })
  consumptionMeterId: string;

  @ApiProperty({
    description: 'Consumption meter OBIS code',
    example: '0100011D00FF',
  })
  consumptionObisCode: string;

  @ApiProperty({
    description: 'Installation ID',
    example: 'installation-1',
  })
  installationId: string;

  @ApiProperty({
    description: 'Measurement type (only "energy" supported)',
    example: 'energy',
  })
  measurement: string;

  @ApiProperty({
    description: 'Start timestamp (ISO 8601)',
    example: '2023-02-01T00:00:00.000Z',
  })
  start: string;

  @ApiProperty({
    description: 'End timestamp (ISO 8601)',
    example: '2023-02-01T23:59:59.999Z',
  })
  stop: string;

  @ApiProperty({
    description: 'Aggregation interval',
    enum: ['d', 'w', 'm', 'y'],
    example: 'd',
    required: false,
    default: 'd',
  })
  interval?: 'd' | 'w' | 'm' | 'y';

  @ApiProperty({
    description: 'Maximum number of results',
    example: '5000',
    required: false,
    default: '5000',
  })
  limit?: string;
}
