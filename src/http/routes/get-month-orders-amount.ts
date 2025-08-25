import dayjs from 'dayjs';
import { and, count, eq, gte, sql } from 'drizzle-orm';
import Elysia from 'elysia';
import { db } from '../../db/connection';
import { orders } from '../../db/schema';
import { UnauthorizedError } from '../errors/unauthorized-error';
import { auth } from './auth';

export const getOrdersMonthAmount = new Elysia()
  .use(auth)
  .get('metrics/orders-month-amount', async ({ getCurrentUser }) => {
    const { restaurantId } = await getCurrentUser();

    if (!restaurantId) {
      throw new UnauthorizedError();
    }

    const today = dayjs();
    const lastMonth = today.subtract(1, 'month');
    const startOfLastMonth = lastMonth.startOf('month');

    const ordersPerMonth = await db
      .select({
        amount: count(),
        monthWithYear: sql<string>`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`,
      })
      .from(orders)
      .where(
        and(
          eq(orders.restaurantId, restaurantId),
          gte(orders.createdAt, startOfLastMonth.toDate()),
        ),
      )
      .groupBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`);

    const currentMonthWithYear = today.format('YYYY-MM');
    const lastMonthWithYear = lastMonth.format('YYYY-MM');

    const currentMonthOrdersAmount = ordersPerMonth.find(
      (orderPerMonth) => orderPerMonth.monthWithYear === currentMonthWithYear,
    );

    const lastMonthOrdersAmount = ordersPerMonth.find(
      (orderPerMonth) => orderPerMonth.monthWithYear === lastMonthWithYear,
    );

    const diffFromLastMonth =
      currentMonthOrdersAmount && lastMonthOrdersAmount
        ? (currentMonthOrdersAmount.amount * 100) / lastMonthOrdersAmount.amount
        : null;

    return {
      revenue: currentMonthOrdersAmount?.amount,
      diffFromLastMonth: diffFromLastMonth
        ? Number((diffFromLastMonth - 100).toFixed(2))
        : 0,
    };
  });
