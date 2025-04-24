import { faker } from '@faker-js/faker/.';
import Location from '../../interfaces/Location';

export default function generateMockLocation(): Location {
  const location: Location = {
    id: faker.number.int(),
    name: faker.person.fullName(),
    address: faker.location.streetAddress(),
    neighborhood: faker.location.county(),
    city: faker.location.city(),
  };

  return location;
}
