import Role from '../../interfaces/Role';
import { faker } from '@faker-js/faker/.';

export default function generateMockRole(): Role {
  const newRole: Role = {
    id: faker.string.uuid(),
    title: faker.book.title(),
  };

  return newRole;
}
