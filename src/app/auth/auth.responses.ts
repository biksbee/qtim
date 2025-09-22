import { ApiProperty } from '@nestjs/swagger';

export class AuthResponses {
  @ApiProperty({ type: 'string', description: 'Access token' })
  accessToken: string;

  @ApiProperty({ type: 'string', description: 'Refresh token' })
  refreshToken: string;
}
