import {
  YogaClassStatus,
  YogaClassType,
} from '../../prisma/generated/prisma-client-js';

export default interface YogaClass {
  id?: number;
  name: string;
  type: YogaClassType;
  status: YogaClassStatus;
  locationId?: number;
  date: Date;
  instructorId: string;
}
