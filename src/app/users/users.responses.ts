import { ApiProperty } from '@nestjs/swagger';
import { UploadedFileResponse } from '../../modules/file-storage/file-storage.responses';

export class UserResponse {
  @ApiProperty({ description: 'User id', example: 1 })
  id: number;

  @ApiProperty({ description: 'User email', example: 'admin@test.aa' })
  email: string;

  @ApiProperty({ description: 'First name of the user', example: 'John', nullable: true })
  first_name: string;

  @ApiProperty({ description: 'Last name of the user', example: 'Doe', nullable: true })
  last_name: string;

  @ApiProperty({ description: 'Phone number of the user', example: '+1234567890', nullable: true })
  phone: string;

  @ApiProperty({ type: UploadedFileResponse })
  file: UploadedFileResponse;

  @ApiProperty({ description: 'Timestamp when the user was last updated', example: '2024-03-06T12:00:00.000Z' })
  updated_at: Date;

  @ApiProperty({ description: 'Timestamp when the user was created', example: '2024-03-01T08:30:00.000Z' })
  created_at: Date;
}

export class UserIdResponse {
  @ApiProperty({ description: 'User id', example: 1 })
  id: number;
}