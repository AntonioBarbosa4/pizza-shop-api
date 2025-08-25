import Elysia from 'elysia';
import { db } from '../../db/connection';
import { auth } from './auth';

export const getProfile = new Elysia().use(auth).get(
  '/me',
  async ({ getCurrentUser, set }) => {
    const { userId } = await getCurrentUser();

    const user = await db.query.users.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, userId);
      },
    });

    if (!user) {
      set.status = 404;
      return { message: 'User not found.' };
    }

    return user;
  },
  {
    detail: {
      tags: ['Users'],
      summary: 'Get user profile',
      description: 'Return a user profile information',
    },
  },
);
