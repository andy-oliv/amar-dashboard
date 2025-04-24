import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import VALIDATION_MESSAGES from '../../utils/messages/validationMessages';

export default class FetchLocationDTO {
  @ApiProperty({
    title: 'Name',
    required: false,
    type: 'string',
    example: 'Casa de Festas Festinha',
  })
  @IsOptional()
  @IsString({
    message: VALIDATION_MESSAGES.EN.location.fetchLocationDTO.name.isString,
  })
  name?: string;

  @ApiProperty({
    title: 'Address',
    required: false,
    type: 'string',
    example: 'Av. Santana, 34',
  })
  @IsOptional()
  @IsString({
    message: VALIDATION_MESSAGES.EN.location.fetchLocationDTO.address.isString,
  })
  address?: string;
}
