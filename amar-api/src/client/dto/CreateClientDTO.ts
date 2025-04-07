import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import VALIDATION_MESSAGES from '../../utils/messages/validationMessages';

export default class CreateClientDTO {
  @ApiProperty({
    title: 'Name',
    required: true,
    type: 'string',
    example: 'John Doe',
  })
  @IsString({
    message: VALIDATION_MESSAGES.EN.client.createClientDTO.name.isString,
  })
  @IsNotEmpty({
    message: VALIDATION_MESSAGES.EN.client.createClientDTO.name.isNotEmpty,
  })
  name: string;

  @ApiProperty({
    title: 'Email',
    required: true,
    type: 'string',
    example: 'john.doe@mail.com',
  })
  @IsEmail(
    {},
    {
      message: VALIDATION_MESSAGES.EN.client.createClientDTO.email.isEmail,
    },
  )
  email: string;

  @ApiProperty({
    title: 'Address',
    required: true,
    type: 'string',
    example: 'Av. Silvio Delmar Hollenbach, 10',
  })
  @IsString({
    message: VALIDATION_MESSAGES.EN.client.createClientDTO.address.isString,
  })
  @IsNotEmpty({
    message: VALIDATION_MESSAGES.EN.client.createClientDTO.address.isNotEmpty,
  })
  address: string;

  @ApiProperty({
    title: 'Neighborhood',
    required: true,
    type: 'string',
    example: 'Rubem Berta',
  })
  @IsString({
    message:
      VALIDATION_MESSAGES.EN.client.createClientDTO.neighborhood.isString,
  })
  @IsNotEmpty({
    message:
      VALIDATION_MESSAGES.EN.client.createClientDTO.neighborhood.isNotEmpty,
  })
  neighborhood: string;

  @ApiProperty({
    title: 'City',
    required: true,
    type: 'string',
    example: 'Porto Alegre',
  })
  @IsString({
    message: VALIDATION_MESSAGES.EN.client.createClientDTO.city.isString,
  })
  @IsNotEmpty({
    message: VALIDATION_MESSAGES.EN.client.createClientDTO.city.isNotEmpty,
  })
  city: string;

  @ApiProperty({
    title: 'CPF',
    required: true,
    type: 'string',
    example: '00899065413',
  })
  @IsString({
    message: VALIDATION_MESSAGES.EN.client.createClientDTO.cpf.isString,
  })
  @IsNotEmpty({
    message: VALIDATION_MESSAGES.EN.client.createClientDTO.cpf.isNotEmpty,
  })
  @Matches(/^\d{11}$/, {
    message: VALIDATION_MESSAGES.EN.client.createClientDTO.cpf.isValidFormat,
  })
  cpf: string;
}
