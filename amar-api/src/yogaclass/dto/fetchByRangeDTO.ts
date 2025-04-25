import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';
import VALIDATION_MESSAGES from '../../utils/messages/validationMessages';
import { ApiProperty } from '@nestjs/swagger';

export default class FetchByRangeDTO {
  @ApiProperty({
    title: 'Date',
    required: true,
    type: 'string',
    description: 'date in ISO 8601 format',
    example: '2025/04/12',
  })
  @IsNotEmpty({
    message:
      VALIDATION_MESSAGES.EN.yogaClass.fetchByRangeDTO.rangeStart.isNotEmpty,
  })
  @IsDateString(
    {},
    {
      message:
        VALIDATION_MESSAGES.EN.yogaClass.fetchByRangeDTO.rangeStart
          .isDateString,
    },
  )
  rangeStart?: string | Date;

  @ApiProperty({
    title: 'Date',
    required: true,
    type: 'string',
    description: 'date in ISO 8601 format',
    example: '2025-04-12',
  })
  @IsNotEmpty({
    message:
      VALIDATION_MESSAGES.EN.yogaClass.fetchByRangeDTO.rangeEnd.isNotEmpty,
  })
  @IsDateString(
    {},
    {
      message:
        VALIDATION_MESSAGES.EN.yogaClass.fetchByRangeDTO.rangeEnd.isDateString,
    },
  )
  rangeEnd?: string | Date;
}
