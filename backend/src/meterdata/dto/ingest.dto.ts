import { ApiProperty } from '@nestjs/swagger';

export class IngestDto {
  @ApiProperty({
    description: 'Tenant identifier',
    example: 'tenant-a',
  })
  tenantId: string;

  @ApiProperty({
    description: 'Installation identifier',
    example: 'installation-1',
  })
  installationId: string;

  @ApiProperty({
    description: 'Public URL to fetch meter data from',
    example: 'https://example.com/data.json',
  })
  url: string;
}