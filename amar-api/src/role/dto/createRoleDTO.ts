import { IsNotEmpty, IsString } from 'class-validator';
import VALIDATION_MESSAGES from '../../utils/messages/validationMessages';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateRoleDTO {
  @ApiProperty({
    title: 'Title',
    required: true,
    type: 'string',
    example: 'Photographer',
  })
  @IsNotEmpty({
    message: VALIDATION_MESSAGES.EN.role.createRoleDTO.title.isNotEmpty,
  })
  @IsString({
    message: VALIDATION_MESSAGES.EN.role.createRoleDTO.title.isString,
  })
  title: string;
}
