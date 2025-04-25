import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsTimeZone,
  IsUUID,
  Matches,
} from 'class-validator';
import {
  YogaClassStatus,
  YogaClassType,
} from '../../../prisma/generated/prisma-client-js';
import { ApiProperty } from '@nestjs/swagger';
import VALIDATION_MESSAGES from '../../utils/messages/validationMessages';

export default class CreateClassDTO {
  @ApiProperty({
    title: 'Type',
    required: true,
    type: 'string',
    description: 'type of class: adults or children',
    example: 'ADULTS',
  })
  @IsNotEmpty({
    message:
      VALIDATION_MESSAGES.EN.yogaClass.createYogaClassDTO.type.isNotEmpty,
  })
  @IsIn(['ADULTS', 'CHILDREN'], {
    message: VALIDATION_MESSAGES.EN.yogaClass.createYogaClassDTO.type.IsIn,
  })
  type: YogaClassType;

  @ApiProperty({
    title: 'Status',
    required: true,
    type: 'string',
    description: 'status of the class: scheduled, cancelled, done, rescheduled',
    example: 'SCHEDULED',
  })
  @IsNotEmpty({
    message:
      VALIDATION_MESSAGES.EN.yogaClass.createYogaClassDTO.status.isNotEmpty,
  })
  @IsIn(['SCHEDULED', 'CANCELLED', 'DONE', 'RESCHEDULED'], {
    message: VALIDATION_MESSAGES.EN.yogaClass.createYogaClassDTO.status.IsIn,
  })
  status: YogaClassStatus;

  @ApiProperty({
    title: 'Location ID',
    required: true,
    type: 'number',
    example: 1,
  })
  @IsNotEmpty({
    message:
      VALIDATION_MESSAGES.EN.yogaClass.createYogaClassDTO.locationId.isNotEmpty,
  })
  @IsNumber(
    { allowNaN: false },
    {
      message:
        VALIDATION_MESSAGES.EN.yogaClass.createYogaClassDTO.locationId.isNumber,
    },
  )
  locationId: number;

  @ApiProperty({
    title: 'Date',
    required: true,
    type: 'string',
    description: 'date in ISO 8601 format',
    example: '2025-04-12',
  })
  @IsNotEmpty({
    message:
      VALIDATION_MESSAGES.EN.yogaClass.createYogaClassDTO.date.isNotEmpty,
  })
  @IsDateString(
    {},
    {
      message:
        VALIDATION_MESSAGES.EN.yogaClass.createYogaClassDTO.date.isDateString,
    },
  )
  date: string | Date;

  @IsNotEmpty({
    message:
      VALIDATION_MESSAGES.EN.yogaClass.createYogaClassDTO.time.isNotEmpty,
  })
  @Matches(/^(?:[01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: VALIDATION_MESSAGES.EN.yogaClass.createYogaClassDTO.time.matches,
  })
  time: string | Date;

  @ApiProperty({
    title: 'Instructor ID',
    required: true,
    type: 'string',
    example: '38151cc3-dfca-419a-a750-b207765497a4',
  })
  @IsNotEmpty({
    message:
      VALIDATION_MESSAGES.EN.yogaClass.createYogaClassDTO.InstructorId
        .isNotEmpty,
  })
  @IsUUID(4, {
    message:
      VALIDATION_MESSAGES.EN.yogaClass.createYogaClassDTO.InstructorId.isUUID,
  })
  instructorId: string;
}
