import { COLLECTIONS } from '../enums/collections.js';
import { STATUS_CODE } from '../enums/statusCode.js';
import connection from '../db/db.js';

async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.send(STATUS_CODE.BAD_REQUEST);
  }

  try {
    const session = await connection.query( `
    SELECT * FROM ${COLLECTIONS.SESSIONS} WHERE token LIKE $1;
    `,
      [`${token}%`]
    );

    if (!session) {
      return res.send(STATUS_CODE.UNAUTHORIZED);
    }

    const user = await connection.query( `
    SELECT * FROM ${COLLECTIONS.USERS} WHERE id LIKE $1;
    `,
      [`${session.userId}%`]
    );

    res.locals.session = session;
    res.locals.user = user;

    next();
  } catch (error) {
    console.log(error);
    return res.send(STATUS_CODE.SERVER_ERROR);
  }
}

export { authMiddleware };