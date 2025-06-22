import Elysia from 'elysia';

import { env } from '../env';
import { authenticateFromLink } from './routes/authenticate-from-link';
import { getManagedRestaurant } from './routes/get-managed-restaurant';
import { getProfile } from './routes/get-profile';
import { registerRestaurant } from './routes/register-restaurant';
import { sendAuthLink } from './routes/send-auth-link';
import { signOut } from './routes/sign-out';

const app = new Elysia()
  .use(registerRestaurant)
  .use(sendAuthLink)
  .use(authenticateFromLink)
  .use(signOut)
  .use(getProfile)
  .use(getManagedRestaurant);

app.get('/', () => 'Hello World!');

app.listen(env.PORT, () =>
  console.log(`Server is running on http://localhost:${env.PORT}`),
);
