import { ApiProperty } from '@nestjs/swagger';

export class ValidationError {
  @ApiProperty({ example: 'field_name', description: 'Field that caused the error' })
  field: string;

  @ApiProperty({ example: 'Field is required', description: 'Error message' })
  message: string;
}

export class ErrorResponse {
  @ApiProperty({ example: 400, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({ example: 'Bad Request', description: 'Error type' })
  error: string;

  @ApiProperty({ type: [ValidationError], description: 'List of validation errors' })
  details: ValidationError[];
}

export const validationApiResOptions = {
  status: 400,
  description: 'Validation error.',
  type: ErrorResponse,
};