import connection from '../db/db.js';
import { nanoid } from 'nanoid'
import { stripHtml } from "string-strip-html";
import { STATUS_CODE } from '../enums/statusCode.js';
import { COLLECTIONS } from '../enums/collections.js';


const shortLink = async (req, res) =>{
  const {url} = req.body;
  const {token} = req.locals.session;
  const cleansedUrl = stripHtml(url).result;
  try {
    const { rows:session } = await connection.query(`
        SELECT * FROM ${COLLECTIONS.SESSIONS} s
        WHERE s.token = $1`,
        [`${token}`]
      );
    if(session === undefined || null || session.length === 0){
      res.status(STATUS_CODE.ERRORUNAUTHORIZED).send(
        `Usuário não autorizado`
        ); 
    }
    const shortenedUrl = nanoid(8);
    connection.query(`
        INSERT INTO ${COLLECTIONS.LINKS} ("url","short","userId")
        VALUES ($1,$2,$3)`,
      [`${cleansedUrl}`,`${shortenedUrl}`,`${session[0].userId}`]
    );
    return res.status(STATUS_CODE.SUCCESSOK).send(shortenedUrl);
  } catch (error) {
      if(error.constraint === 'proper_url') return res.status(STATUS_CODE.ERRORUNPROCESSABLEENTITY).send({message:'Invalid URL Format'});
      return res.sendStatus(STATUS_CODE.SERVERERRORINTERNAL);
  };
};

const showShort = async (req, res) =>{
  const { id } = req.params;
  if(isNaN(parseInt(id))) return res.sendStatus(STATUS_CODE.ERRORUNPROCESSABLEENTITY);
  try {
      const { rows:url } = await connection.query(`
          SELECT * FROM  ${COLLECTIONS.LINKS} l
          WHERE u.id = $1`,
        [`${id}`]
      );
      if(!url.length > 0) return res.sendStatus(STATUS_CODE.ERRORNOTFOUND)
      const body = {
          id: url[0].id,
          url: url[0].url,
          shortUrl: url[0].short
      };
      res.status(STATUS_CODE.SUCCESSOK).send(body);
  } catch (error) {
    return res.sendStatus(STATUS_CODE.SERVERERRORINTERNAL);
  }
};

const openShort = async (req, res) =>{
  const { shortUrl } = req.params;
  const cleansedUrl = stripHtml(shortUrl).result;
  try {
      const { rows:url } = connection.query(`
        SELECT * FROM ${COLLECTIONS.LINKS} l
        WHERE "short" = $1`,
      [cleansedUrl]
    );
      if(!url.length > 0) return res.sendStatus(STATUS_CODE.ERRORNOTFOUND);
      connection.query(`
          UPDATE ${COLLECTIONS.LINKS}
          SET "visitCount" = "visitCount" + 1
          WHERE "short" = $1`,
        [cleansedUrl]
        );
      res.redirect(STATUS_CODE.SUCCESSOK,url[0].url);
  } catch (error) {
      res.sendStatus(STATUS_CODE.SERVERERRORINTERNAL);
  }
};

const deleteShort = async (req, res) =>{
  const {token} = req.locals.session;
  const { id } = req.params;
    if(isNaN(parseInt(id))) return res.sendStatus(STATUS_CODE.ERRORUNPROCESSABLEENTITY);
  try {
    const { rows:session } = await connection.query(`
      SELECT * FROM ${COLLECTIONS.SESSIONS} s
      WHERE s.token = $1`,
    [`${token}`]
  );
  if(session === undefined || null || session.length === 0){
    res.status(STATUS_CODE.ERRORUNAUTHORIZED).send(
      `Usuário não autorizado`
      ); 
  }
  const { rows:url } = await connection.query(`
      SELECT * FROM  ${COLLECTIONS.LINKS} l
      WHERE u.id = $1`,
    [`${id}`]
  );
  if(!url.length > 0 || url === undefined || url === null){
    return res.sendStatus(STATUS_CODE.ERRORNOTFOUND);
  }
  if(url[0].userId !== session[0].userId) return res.sendStatus(STATUS_CODE.ERRORUNAUTHORIZED)
  connection.query(`
      DELETE FROM ${COLLECTIONS.LINKS} l
      WHERE id = $1`,
    [`${id}`]
  );
  res.sendStatus(STATUS_CODE.SUCCESSNOCONTENT);
  } catch (error) { 
    return res.sendStatus(STATUS_CODE.SERVERERRORINTERNAL)
  }
};

const listShortUsers = async (req, res) =>{
  const { token } = req.locals;
  try {
    const { rows:session } = await connection.query(`
        SELECT s.*,users.name FROM ${COLLECTIONS.SESSIONS} s
        JOIN ${COLLECTIONS.USERS} ON ${COLLECTIONS.USERS}.id = s."userId"
        WHERE s.token = $1`,
      [`${token}`]
    );
    if(!session.length > 0) return res.sendStatus(COLLECTIONS.ERRORUNAUTHORIZED);
    const { rows:userInfo } = connection.query(`
        SELECT u.id,u.url,u."short",u."visitCount" FROM ${COLLECTIONS.RANKING} u
        WHERE u."userId" = $1
        ORDER BY u."visitCount" DESC`,
      [`${session[0].userId}`]
    );
      let totalVisits = 0
      userInfo.forEach(url => totalVisits+=url.visitCount);
      const body = {
          id: session[0].userId,
          name: session[0].name,
          visitCount: totalVisits,
          shortenedUrls: userInfo
      }
      res.status(STATUS_CODE.SUCCESSOK).send(body);
  } catch (error) {
      res.sendStatus(STATUS_CODE.SERVERERRORINTERNAL);
  }
};

const showRanking = async (req, res) =>{
  try {
    const { rows:body } = await connection.query(`
    SELECT usr.id,usr.name,COUNT(u.id) as "linksCount",
    COALESCE(SUM(u."visitCount"),0) as "visitCount" FROM ${COLLECTIONS.USERS} usr
    LEFT JOIN ${COLLECTIONS.LINKS} u ON usr.id = u."userId"
    GROUP BY usr.id
    ORDER BY "visitCount" DESC
    LIMIT 10`);

    connection.query(`
    SELECT u.id,u.url,u."shortUrl",u."visitCount" FROM ${COLLECTIONS.LINKS} u
    WHERE u."userId" = $1
    ORDER BY u."visitCount" DESC`,[`${id}`]);
    res.status(STATUS_CODE.SUCCESSOK).send(body)
  } catch (error) {
    res.sendStatus(STATUS_CODE.SERVERERRORINTERNAL);
  }
};

export {showRanking,listShortUsers,deleteShort,openShort,showShort,shortLink };