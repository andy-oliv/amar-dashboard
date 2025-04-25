import { faker } from '@faker-js/faker/.';
import YogaClass from '../../interfaces/YogaClass';

export default function generateMockYogaClass(): YogaClass {
  const newClass: YogaClass = {
    id: faker.number.int(),
    type: getRandomString(['ADULTS', 'CHILDREN']),
    status: getRandomString(['SCHEDULED', 'CANCELLED', 'DONE', 'RESCHEDULED']),
    date: faker.date.soon(),
    time: faker.date.soon().toTimeString().split(' ')[0],
    instructorId: faker.string.uuid(),
    locationId: faker.number.int(),
  };

  return newClass;
}

function getRandomString(values: string[]): any {
  const randomIndex: number = Math.floor(Math.random() * values.length);
  const randomValue: string = values[randomIndex];
  return randomValue;
}
