import Client from '../../interfaces/Client';
import { faker } from '@faker-js/faker/.';

export default function generateMockClient(): Client {
  const client: Client = {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    address: faker.location.streetAddress(),
    neighborhood: faker.location.county(),
    city: faker.location.city(),
    cpf: `${faker.number.int({ min: 11, max: 11 })}`,
  };

  return client;
}
