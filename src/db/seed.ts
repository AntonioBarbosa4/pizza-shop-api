import { faker } from '@faker-js/faker';
import { createId } from '@paralleldrive/cuid2';
import { db } from './connection';
import {
  authLinks,
  orderItems,
  orders,
  products,
  restaurants,
  users,
} from './schema';

await db.delete(users);
await db.delete(restaurants);
await db.delete(orderItems);
await db.delete(orders);
await db.delete(products);
await db.delete(authLinks);

const [customer1, customer2] = await db
  .insert(users)
  .values([
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
  ])
  .returning();

console.log('Customers created ✅');

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

console.log('Manager created ✅');

const [restaurant] = await db
  .insert(restaurants)
  .values([
    {
      name: faker.company.name(),
      description: faker.lorem.paragraph(),
      managerId: manager!.id,
    },
  ])
  .returning();

console.log('Restaurant created ✅');

function generateProducts(): {
  name: string;
  restaurantId: string;
  description: string;
  priceInCents: number;
} {
  return {
    name: faker.commerce.productName(),
    restaurantId: restaurant!.id,
    description: faker.commerce.productDescription(),
    priceInCents: Number(faker.commerce.price({ min: 190, max: 490, dec: 0 })),
  };
}

const availableProducts = await db
  .insert(products)
  .values([
    generateProducts(),
    generateProducts(),
    generateProducts(),
    generateProducts(),
    generateProducts(),
    generateProducts(),
    generateProducts(),
  ])
  .returning();

console.log('Products created ✅');

type OrderItemsInsert = typeof orderItems.$inferInsert;
type OrderInsert = typeof orders.$inferInsert;

const orderItemsToInsert: OrderItemsInsert[] = [];
const orderToInsert: OrderInsert[] = [];

for (let i = 0; i < 200; i++) {
  const orderId = createId();

  const orderProducts = faker.helpers.arrayElements(availableProducts, {
    min: 1,
    max: 3,
  });

  let totalInCents = 0;

  orderProducts.forEach((orderProduct) => {
    const quantity = faker.number.int({ min: 1, max: 3 });
    totalInCents += orderProduct.priceInCents * quantity;

    orderItemsToInsert.push({
      orderId,
      priceInCents: orderProduct.priceInCents,
      quantity,
      productId: orderProduct.id,
    });
  });

  orderToInsert.push({
    id: orderId,
    restaurantId: restaurant!.id,
    customerId: faker.helpers.arrayElement([customer1!.id, customer2!.id]),
    totalInCents,
    status: faker.helpers.arrayElement([
      'pending',
      'processing',
      'delivering',
      'delivered',
      'canceled',
    ]),
    createdAt: faker.date.recent({ days: 40 }),
  });
}

await db.insert(orders).values(orderToInsert);

console.log('Orders created ✅');

await db.insert(orderItems).values(orderItemsToInsert);

console.log('Order items created ✅');

process.exit(0);
