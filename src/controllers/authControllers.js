
import bcrypt from 'bcrypt';
import connection from '../db/db.js';
import { v4 as uuid } from 'uuid';
import { STATUS_CODE } from '../enums/statusCode.js';
import { COLLECTIONS } from '../enums/collections.js';
import { schemaCadrasto,schemaLogin } from '../schemas/authSchemas.js';


const signUp = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  const newUser = {
    name,
    email,
    password,
    confirmPassword
  };

  const valid = schemaCadrasto.validate(newUser, {abortEarly: false});

  if(valid.errorMessage || confirmPassword !== password ){
    const erros = validation.error.details.map((err) => err.message);
    res.status(STATUS_CODE.ERRORUNPROCESSABLEENTITY).send(
      `Todos os campos são obrigatórios! : ${erros}`
      ); 
    return
  };

  const passwordHash = bcrypt.hashSync(newUser.password, 10);
  try {
    const verificaUser = await connection.query( `
    SELECT * FROM ${COLLECTIONS.USERS} WHERE email LIKE $1;
    `,
      [`${email}%`]
    );

    if(!verificaUser) {
      return res.status(STATUS_CODE.ERRORCONFLICT).send(
        `Email existente : ${email}`)
    };
    await connection.query(
      `
      INSERT INTO ${COLLECTIONS.USERS} 
        (name, email, password)
      VALUES 
        ($1, $2, $3);
    `,
      [`${name}`, `${email}`,`${passwordHash}`]
    );
    res.status(STATUS_CODE.SUCCESSCREATED).send(`Criado com sucesso`);
    return
  }
  catch (err) {
    console.error(err);
    res.sendStatus(STATUS_CODE.SERVERERRORINTERNAL);
    return
  };
}

const signIn = async (req, res) => {
  const { email, password } = req.body;
  const userLogin = { email, password };
  const valid = schemaLogin.validate(userLogin, {abortEarly: false});

  if(valid.errorMessage){
    const erros = validation.error.details.map((err) => err.message);
    res.status(STATUS_CODE.ERRORUNPROCESSABLEENTITY).send(
      `Todos os campos são obrigatórios! : ${erros}`
      ); 
    return
  };

  try {
    const {rows:user}= await connection.query( `
    SELECT * FROM ${COLLECTIONS.USERS} WHERE email LIKE $1;
    `,
      [`${email}`]
    );

    if(user === undefined || null){
      res.status(STATUS_CODE.ERRORUNPROCESSABLEENTITY).send(
        `Usuário não encontrado (email ou senha incorretos)`
        ); 
    }
    const passwordIsValid = await bcrypt.compare(password,user[0].password);
    
    if(user && passwordIsValid) {
        const token = uuid();
        connection.query(
          `
          INSERT INTO ${COLLECTIONS.SESSIONS} 
            ("userId", "token")
          VALUES 
            ($1, $2);
        `,
          [`${user[0].id}`, `${token}`]
        );
        const response = {token, name: user[0].name , email: user[0].email, password};
        if(response){
          res.status(STATUS_CODE.SUCCESSCREATED).send(response);
          return
        }
    } else {
      res.status(STATUS_CODE.ERRORUNPROCESSABLEENTITY).send(
        `Usuário não encontrado (email ou senha incorretos)`
        ); 
    }
  }
  catch (err) {
    console.error(err);
    res.sendStatus(STATUS_CODE.SERVERERRORINTERNAL);
    return
  };
}

export {signIn,signUp};