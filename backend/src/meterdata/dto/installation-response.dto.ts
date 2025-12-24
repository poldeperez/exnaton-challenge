import { ApiProperty } from '@nestjs/swagger';

export class MeterDto {
  @ApiProperty({
    description: 'Meter identifier',
    example: 'meter-123',
  })
  meterId: string;

  @ApiProperty({
    description: 'OBIS code for the meter',
    example: '0100021D00FF',
  })
  obisCode: string;
}

export class InstallationDto {
  @ApiProperty({
    description: 'Installation identifier',
    example: 'installation-1',
  })
  id: string;

  @ApiProperty({
    description: 'Installation name',
    example: 'installation-1',
  })
  name: string;

  @ApiProperty({
    description: 'List of meters associated with this installation',
    type: [MeterDto],
  })
  meters: MeterDto[];
}
