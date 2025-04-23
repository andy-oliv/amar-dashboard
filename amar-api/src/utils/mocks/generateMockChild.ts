import { faker } from '@faker-js/faker/.';
import Child from '../../interfaces/Child';

export default function generateMockChild(): Child {
  const child: Child = {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    parentId: [faker.string.uuid(), faker.string.uuid()],
  };

  return child;
}
