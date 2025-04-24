import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  YogaClassStatus,
  YogaClassType,
} from '../../../prisma/generated/prisma-client-js';

export default class createClassDTO {
  @IsNotEmpty({ message: '' })
  @IsString({ message: '' })
  name: string;

  @IsNotEmpty({ message: '' })
  @IsIn(['ADULTS', 'CHILDREN'], { message: '' })
  type: YogaClassType;

  @IsNotEmpty({ message: '' })
  @IsIn(['SCHEDULED', 'CANCELLED', 'DONE', 'RESCHEDULED'], { message: '' })
  status: YogaClassStatus;

  @IsNotEmpty({ message: '' })
  @IsNumber({ allowNaN: false }, { message: '' })
  locationId: number;

  @IsNotEmpty({ message: '' })
  @IsDateString({}, { message: '' })
  date: Date;

  @IsNotEmpty({ message: '' })
  @IsUUID(4, { message: '' })
  instructorId: string;
}
