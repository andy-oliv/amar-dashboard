import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt, IsNotEmpty } from 'class-validator';
import VALIDATION_MESSAGES from '../../utils/messages/validationMessages';

export default class CreateRollCallDTO {
  @ApiProperty({
    title: 'Class ID',
    required: true,
    type: 'number',
    example: 1,
  })
  @IsNotEmpty({
    message:
      VALIDATION_MESSAGES.EN.rollCall.createRollCallDTO.classId.isNotEmpty,
  })
  @IsInt({
    message: VALIDATION_MESSAGES.EN.rollCall.createRollCallDTO.classId.isInt,
  })
  classId: number;

  @ApiProperty({
    title: 'Date',
    required: true,
    type: 'string',
    example: '2025-05-10',
  })
  @IsNotEmpty({
    message: VALIDATION_MESSAGES.EN.rollCall.createRollCallDTO.date.isNotEmpty,
  })
  @IsDate({
    message: VALIDATION_MESSAGES.EN.rollCall.createRollCallDTO.date.isDate,
  })
  date: Date;
}
