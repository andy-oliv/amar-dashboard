import { IsNotEmpty, IsString } from 'class-validator';
import VALIDATION_MESSAGES from '../../utils/messages/validationMessages';
import { ApiProperty } from '@nestjs/swagger';

export default class UpdateChildDTO {
  @ApiProperty({
    title: 'Name',
    required: true,
    type: 'string',
    example: 'Valentina',
  })
  @IsNotEmpty({
    message: VALIDATION_MESSAGES.EN.child.createChildDTO.name.isNotEmpty,
  })
  @IsString({
    message: VALIDATION_MESSAGES.EN.child.createChildDTO.name.isString,
  })
  name: string;
}
