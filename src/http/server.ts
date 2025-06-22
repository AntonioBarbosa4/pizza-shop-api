import Elysia from 'elysia';

import { env } from '../env';
import { authenticateFromLink } from './routes/authenticate-from-link';
import { registerRestaurant } from './routes/register-restaurant';
import { sendAuthLink } from './routes/send-auth-link';
import { signOut } from './routes/sign-out';

const app = new Elysia()
  .use(registerRestaurant)
  .use(sendAuthLink)
  .use(authenticateFromLink)
  .use(signOut);

app.get('/', () => 'Hello World!');

app.listen(env.PORT, () =>
  console.log(`Server is running on http://localhost:${env.PORT}`),
);
