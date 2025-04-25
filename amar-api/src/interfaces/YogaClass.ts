import {
  YogaClassStatus,
  YogaClassType,
} from '../../prisma/generated/prisma-client-js';

export default interface YogaClass {
  id?: number;
  type: YogaClassType;
  status: YogaClassStatus;
  locationId: number;
  date: Date;
  time?: string | Date;
  instructorId: string;
}
