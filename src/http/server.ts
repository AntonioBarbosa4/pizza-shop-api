import Elysia from 'elysia';

import { env } from '../env';
import { approveOrder } from './routes/approve-order';
import { authenticateFromLink } from './routes/authenticate-from-link';
import { cancelOrder } from './routes/cancel-order';
import { deliverOrder } from './routes/deliver-order';
import { dispatchOrder } from './routes/dispatch-order';
import { getDayOrdersAmount } from './routes/get-day-orders-amount';
import { getManagedRestaurant } from './routes/get-managed-restaurant';
import { getMonthCanceledOrdersAmount } from './routes/get-month-canceled-orders-amount';
import { getMonthOrdersAmount } from './routes/get-month-orders-amount';
import { getMonthRevenue } from './routes/get-month-revenue';
import { getOrderDetails } from './routes/get-order-details';
import { getOrders } from './routes/get-orders';
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
  .use(getManagedRestaurant)
  .use(getOrderDetails)
  .use(approveOrder)
  .use(cancelOrder)
  .use(deliverOrder)
  .use(dispatchOrder)
  .use(getOrders)
  .use(getMonthRevenue)
  .use(getDayOrdersAmount)
  .use(getMonthOrdersAmount)
  .use(getMonthCanceledOrdersAmount)
  .onError(({ code, error, set }) => {
    switch (code) {
      case 'VALIDATION': {
        set.status = error.status;
        return error.toResponse();
      }
      case 'NOT_FOUND': {
        return new Response(null, { status: 404 });
      }
      default: {
        console.error(error);
        return new Response(null, { status: 500 });
      }
    }
  });

app.get('/', () => 'Hello World!');

app.listen(env.PORT, () =>
  console.log(`Server is running on http://localhost:${env.PORT}`),
);
