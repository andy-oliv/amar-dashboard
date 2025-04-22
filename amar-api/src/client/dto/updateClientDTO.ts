import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Matches } from 'class-validator';
import VALIDATION_MESSAGES from '../../utils/messages/validationMessages';

export default class updateClientDTO {
  @ApiProperty({
    title: 'Name',
    required: false,
    type: 'string',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString({
    message: VALIDATION_MESSAGES.EN.client.createClientDTO.name.isString,
  })
  name?: string;

  @ApiProperty({
    title: 'Email',
    required: false,
    type: 'string',
    example: 'john.doe@mail.com',
  })
  @IsOptional()
  @IsEmail(
    {},
    {
      message: VALIDATION_MESSAGES.EN.client.createClientDTO.email.isEmail,
    },
  )
  email?: string;

  @ApiProperty({
    title: 'Address',
    required: false,
    type: 'string',
    example: 'Av. Silvio Delmar Hollenbach, 10',
  })
  @IsOptional()
  @IsString({
    message: VALIDATION_MESSAGES.EN.client.createClientDTO.address.isString,
  })
  address?: string;

  @ApiProperty({
    title: 'Neighborhood',
    required: false,
    type: 'string',
    example: 'Rubem Berta',
  })
  @IsOptional()
  @IsString({
    message:
      VALIDATION_MESSAGES.EN.client.createClientDTO.neighborhood.isString,
  })
  neighborhood?: string;

  @ApiProperty({
    title: 'City',
    required: false,
    type: 'string',
    example: 'Porto Alegre',
  })
  @IsOptional()
  @IsString({
    message: VALIDATION_MESSAGES.EN.client.createClientDTO.city.isString,
  })
  city?: string;

  @ApiProperty({
    title: 'CPF',
    required: false,
    type: 'string',
    example: '00899065413',
  })
  @IsOptional()
  @IsString({
    message: VALIDATION_MESSAGES.EN.client.createClientDTO.cpf.isString,
  })
  @Matches(/^\d{11}$/, {
    message: VALIDATION_MESSAGES.EN.client.createClientDTO.cpf.isValidFormat,
  })
  cpf?: string;
}
