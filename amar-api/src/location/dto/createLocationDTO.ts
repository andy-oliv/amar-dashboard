import { IsNotEmpty, IsString } from 'class-validator';
import VALIDATION_MESSAGES from '../../utils/messages/validationMessages';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateLocationDTO {
  @ApiProperty({
    title: 'Name',
    required: true,
    type: 'string',
    example: 'Casa de Festas Festejou',
  })
  @IsNotEmpty({
    message: VALIDATION_MESSAGES.EN.location.createLocationDTO.name.isNotEmpty,
  })
  @IsString({
    message: VALIDATION_MESSAGES.EN.location.createLocationDTO.name.isString,
  })
  name: string;

  @ApiProperty({
    title: 'Address',
    required: true,
    type: 'string',
    example: 'Rua dos Ventos, 200',
  })
  @IsNotEmpty({
    message:
      VALIDATION_MESSAGES.EN.location.createLocationDTO.address.isNotEmpty,
  })
  @IsString({
    message: VALIDATION_MESSAGES.EN.location.createLocationDTO.address.isString,
  })
  address: string;

  @ApiProperty({
    title: 'Neighborhood',
    required: true,
    type: 'string',
    example: 'Baixada Norte',
  })
  @IsNotEmpty({
    message:
      VALIDATION_MESSAGES.EN.location.createLocationDTO.neighborhood.isNotEmpty,
  })
  @IsString({
    message:
      VALIDATION_MESSAGES.EN.location.createLocationDTO.neighborhood.isString,
  })
  neighborhood: string;

  @ApiProperty({
    title: 'City',
    required: true,
    type: 'string',
    example: 'Canoas',
  })
  @IsNotEmpty({
    message: VALIDATION_MESSAGES.EN.location.createLocationDTO.city.isNotEmpty,
  })
  @IsString({
    message: VALIDATION_MESSAGES.EN.location.createLocationDTO.city.isString,
  })
  city: string;
}
