import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import VALIDATION_MESSAGES from '../../utils/messages/validationMessages';

export default class CreateChildDTO {
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

  @ApiProperty({
    title: 'Parent ID',
    required: true,
    type: 'array',
    example: '["1r01jf9fY$m", "00YHDM4@#"]',
  })
  @IsNotEmpty({
    message: VALIDATION_MESSAGES.EN.child.createChildDTO.parentId.isNotEmpty,
  })
  @IsArray({
    message: VALIDATION_MESSAGES.EN.child.createChildDTO.parentId.isArray,
  })
  parentId: string[];
}
