import Elysia, { t } from 'elysia';
import { db } from '../db/connection';
import { restaurants, users } from '../db/schema';
import { env } from '../env';

const app = new Elysia();

app.get('/', () => 'Hello World!');

app.post(
  '/restaurant',
  async ({ body, set }) => {
    const { restaurantName, name, email, phone } = body;

    const [manager] = await db
      .insert(users)
      .values({
        name,
        email,
        phone,
        role: 'manager',
      })
      .returning({
        id: users.id,
      });

    await db.insert(restaurants).values({
      name: restaurantName,
      description: 'A great restaurant',
      managerId: manager!.id,
    });

    set.status = 201;
  },
  {
    body: t.Object({
      restaurantName: t.String(),
      name: t.String(),
      email: t.String({ format: 'email' }),
      phone: t.String(),
    }),
  },
);

app.listen(env.PORT, () =>
  console.log(`Server is running on http://localhost:${env.PORT}`),
);
