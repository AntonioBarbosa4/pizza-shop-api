import { faker } from '@faker-js/faker';
import { db } from './connection';
import { restaurants, users } from './schema';

await db.delete(users);
await db.delete(restaurants);

await db.insert(users).values([
  {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: 'customer',
    phone: faker.phone.number(),
  },
  {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: 'customer',
    phone: faker.phone.number(),
  },
]);

const [manager] = await db
  .insert(users)
  .values([
    {
      name: faker.person.fullName(),
      email: 'admin@admin.com',
      role: 'customer',
      phone: faker.phone.number(),
    },
  ])
  .returning({
    id: users.id,
  });

await db.insert(restaurants).values([
  {
    name: faker.company.name(),
    description: faker.lorem.paragraph(),
    managerId: manager!.id,
  },
]);

process.exit(0);
