import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUUID,
} from 'class-validator';
import VALIDATION_MESSAGES from '../../utils/messages/validationMessages';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateUserDTO {
  @ApiProperty({
    title: 'Name',
    required: true,
    type: 'string',
    example: 'John Doe',
  })
  @IsNotEmpty({
    message: VALIDATION_MESSAGES.EN.user.createUserDTO.name.isNotEmpty,
  })
  @IsString({
    message: VALIDATION_MESSAGES.EN.user.createUserDTO.name.isString,
  })
  name: string;

  @ApiProperty({
    title: 'Email',
    required: true,
    type: 'string',
    example: 'john.doe@mail.com',
  })
  @IsNotEmpty({
    message: VALIDATION_MESSAGES.EN.user.createUserDTO.email.isNotEmpty,
  })
  @IsEmail(
    {},
    { message: VALIDATION_MESSAGES.EN.user.createUserDTO.email.isEmail },
  )
  email: string;

  @ApiProperty({
    title: 'Password',
    required: true,
    type: 'string',
    example: '140d#84$mmJD',
  })
  @IsNotEmpty({
    message: VALIDATION_MESSAGES.EN.user.createUserDTO.password.isNotEmpty,
  })
  @IsStrongPassword(
    { minLength: 8 },
    {
      message:
        VALIDATION_MESSAGES.EN.user.createUserDTO.password.isStrongPassword,
    },
  )
  password: string;

  @ApiProperty({
    title: 'Picture URL',
    required: false,
    type: 'string',
    example: 'https://google.com/images/101rf0kUU',
  })
  @IsOptional()
  @IsString({
    message: VALIDATION_MESSAGES.EN.user.createUserDTO.pictureUrl.isString,
  })
  pictureUrl: string;

  @ApiProperty({
    title: 'Role ID',
    required: true,
    type: 'array',
    example: '["f10j9gj29gj29aq&&d", "ffg91jed&#dlçç"]',
  })
  @IsOptional()
  @IsUUID(4, {
    each: true,
    message: VALIDATION_MESSAGES.EN.user.createUserDTO.roleId.isUUID,
  })
  roleId: string[];
}
