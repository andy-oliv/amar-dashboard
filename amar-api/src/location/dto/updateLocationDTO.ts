import { IsOptional, IsString } from 'class-validator';
import VALIDATION_MESSAGES from '../../utils/messages/validationMessages';
import { ApiProperty } from '@nestjs/swagger';

export default class UpdateLocationDTO {
  @ApiProperty({
    title: 'Name',
    required: false,
    type: 'string',
    example: 'Casa de Festas Festejou',
  })
  @IsOptional()
  @IsString({
    message: VALIDATION_MESSAGES.EN.location.updateLocationDTO.name.isString,
  })
  name?: string;

  @ApiProperty({
    title: 'Address',
    required: false,
    type: 'string',
    example: 'Rua dos Ventos, 200',
  })
  @IsOptional()
  @IsString({
    message: VALIDATION_MESSAGES.EN.location.updateLocationDTO.address.isString,
  })
  address?: string;

  @ApiProperty({
    title: 'Neighborhood',
    required: false,
    type: 'string',
    example: 'Baixada Norte',
  })
  @IsOptional()
  @IsString({
    message:
      VALIDATION_MESSAGES.EN.location.updateLocationDTO.neighborhood.isString,
  })
  neighborhood?: string;

  @ApiProperty({
    title: 'City',
    required: false,
    type: 'string',
    example: 'Canoas',
  })
  @IsOptional()
  @IsString({
    message: VALIDATION_MESSAGES.EN.location.updateLocationDTO.city.isString,
  })
  city?: string;
}
