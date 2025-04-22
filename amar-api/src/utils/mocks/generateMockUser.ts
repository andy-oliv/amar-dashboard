import { faker } from '@faker-js/faker/.';
import { User } from '../../interfaces/User';

export default function generateMockUser(): User {
  const user: User = {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 12 }),
    pictureUrl: faker.internet.url(),
  };

  return user;
}
