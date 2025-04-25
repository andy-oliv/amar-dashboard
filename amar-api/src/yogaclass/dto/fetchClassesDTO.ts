import {
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';
import VALIDATION_MESSAGES from '../../utils/messages/validationMessages';
import { ApiProperty } from '@nestjs/swagger';
import {
  YogaClassStatus,
  YogaClassType,
} from '../../../prisma/generated/prisma-client-js';

export default class FetchClassesDTO {
  @ApiProperty({
    title: 'Type',
    required: false,
    type: 'string',
    description: 'type of class: adults or children',
    example: 'ADULTS',
  })
  @IsOptional()
  @IsIn(['ADULTS', 'CHILDREN'], {
    message: VALIDATION_MESSAGES.EN.yogaClass.fetchClassesDTO.type.IsIn,
  })
  type?: YogaClassType;

  @ApiProperty({
    title: 'Status',
    required: false,
    type: 'string',
    description: 'status of the class: scheduled, cancelled, done, rescheduled',
    example: 'SCHEDULED',
  })
  @IsOptional()
  @IsIn(['SCHEDULED', 'CANCELLED', 'DONE', 'RESCHEDULED'], {
    message: VALIDATION_MESSAGES.EN.yogaClass.fetchClassesDTO.status.IsIn,
  })
  status?: YogaClassStatus;

  @ApiProperty({
    title: 'Location ID',
    required: false,
    type: 'number',
    example: 2,
  })
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber(
    { allowNaN: false },
    {
      message:
        VALIDATION_MESSAGES.EN.yogaClass.fetchClassesDTO.locationId.isNumber,
    },
  )
  locationId?: number;

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
        VALIDATION_MESSAGES.EN.yogaClass.fetchClassesDTO.date.isDateString,
    },
  )
  date?: string | Date;

  @ApiProperty({
    title: 'Instructor ID',
    required: false,
    type: 'string',
    example: '38151cc3-dfca-419a-a750-b207765497a4',
  })
  @IsOptional()
  @IsUUID(4, {
    message:
      VALIDATION_MESSAGES.EN.yogaClass.fetchClassesDTO.InstructorId.isUUID,
  })
  instructorId?: string;
}
