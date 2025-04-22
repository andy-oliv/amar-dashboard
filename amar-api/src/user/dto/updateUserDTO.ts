import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUUID,
} from 'class-validator';
import VALIDATION_MESSAGES from '../../utils/messages/validationMessages';
import { ApiProperty } from '@nestjs/swagger';

export default class UpdateUserDTO {
  @ApiProperty({
    title: 'Name',
    required: false,
    type: 'string',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString({
    message: VALIDATION_MESSAGES.EN.user.updateUserDTO.name.isString,
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
    { message: VALIDATION_MESSAGES.EN.user.updateUserDTO.email.isEmail },
  )
  email?: string;

  @ApiProperty({
    title: 'Password',
    required: false,
    type: 'string',
    example: '140d#84$mmJD',
  })
  @IsOptional()
  @IsStrongPassword(
    { minLength: 8 },
    {
      message:
        VALIDATION_MESSAGES.EN.user.updateUserDTO.password.isStrongPassword,
    },
  )
  password?: string;

  @ApiProperty({
    title: 'Picture URL',
    required: false,
    type: 'string',
    example: 'https://google.com/images/101rf0kUU',
  })
  @IsOptional()
  @IsString({
    message: VALIDATION_MESSAGES.EN.user.updateUserDTO.pictureUrl.isString,
  })
  pictureUrl?: string;

  @ApiProperty({
    title: 'Role ID',
    required: false,
    type: 'array',
    example: '["f10j9gj29gj29aq&&d", "ffg91jed&#dlçç"]',
  })
  @IsOptional()
  @IsUUID(4, {
    each: true,
    message: VALIDATION_MESSAGES.EN.user.updateUserDTO.roleId.isUUID,
  })
  roleId?: string[];
}
