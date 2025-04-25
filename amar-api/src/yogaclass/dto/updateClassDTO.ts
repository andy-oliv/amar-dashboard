import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Matches,
} from 'class-validator';
import VALIDATION_MESSAGES from '../../utils/messages/validationMessages';
import { ApiProperty } from '@nestjs/swagger';
import {
  YogaClassStatus,
  YogaClassType,
} from '../../../prisma/generated/prisma-client-js';

export default class UpdateClassDTO {
  @ApiProperty({
    title: 'Type',
    required: false,
    type: 'string',
    description: 'type of class: adults or children',
    example: 'ADULTS',
  })
  @IsOptional()
  @IsIn(['ADULTS', 'CHILDREN'], {
    message: VALIDATION_MESSAGES.EN.yogaClass.updateClassDTO.type.IsIn,
  })
  type: YogaClassType;

  @ApiProperty({
    title: 'Status',
    required: false,
    type: 'string',
    description: 'status of the class: scheduled, cancelled, done, rescheduled',
    example: 'SCHEDULED',
  })
  @IsOptional()
  @IsIn(['SCHEDULED', 'CANCELLED', 'DONE', 'RESCHEDULED'], {
    message: VALIDATION_MESSAGES.EN.yogaClass.updateClassDTO.status.IsIn,
  })
  status: YogaClassStatus;

  @ApiProperty({
    title: 'Location ID',
    required: false,
    type: 'number',
    example: 3,
  })
  @IsOptional()
  @IsNumber(
    { allowNaN: false },
    {
      message:
        VALIDATION_MESSAGES.EN.yogaClass.updateClassDTO.locationId.isNumber,
    },
  )
  locationId: number;

  @ApiProperty({
    title: 'Date',
    required: false,
    type: 'string',
    description: 'date in ISO 8601 format',
    example: '2025-04-12',
  })
  @IsOptional()
  @IsDateString(
    {},
    {
      message:
        VALIDATION_MESSAGES.EN.yogaClass.updateClassDTO.date.isDateString,
    },
  )
  date: string | Date;

  @ApiProperty({
    title: 'Time',
    required: false,
    type: 'string',
    example: 'Valid time following the format HH:mm:ss in 24 hours.',
  })
  @IsOptional()
  @Matches(/^(?:[01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: VALIDATION_MESSAGES.EN.yogaClass.updateClassDTO.time.matches,
  })
  time: string | Date;

  @ApiProperty({
    title: 'Instructor ID',
    required: false,
    type: 'string',
    example: '38151cc3-dfca-419a-a750-b207765497a4',
  })
  @IsOptional()
  @IsUUID(4, {
    message:
      VALIDATION_MESSAGES.EN.yogaClass.updateClassDTO.InstructorId.isUUID,
  })
  instructorId: string;
}
