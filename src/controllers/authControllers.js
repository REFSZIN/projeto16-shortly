
import bcrypt from 'bcrypt';
import mongo from '../db/db.js';
import { v4 as uuid } from 'uuid';
import { STATUS_CODE } from '../enums/statusCode.js';
import { COLLECTIONS } from '../enums/collections.js';
import { schemaCadrasto,schemaLogin } from '../schemas/authSchemas.js';

let db = await mongo();

const signUp = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  const newUser = {
    name,
    email,
    password,
    confirmPassword
  };

  const valid = schemaCadrasto.validate(newUser, {abortEarly: false});

  if(valid.errorMessage){
    const erros = validation.error.details.map((err) => err.message);
    res.status(STATUS_CODE.ERRORUNPROCESSABLEENTITY).send(
      `Todos os campos são obrigatórios! : ${erros}`
      ); 
    return
  };
  const passwordHash = bcrypt.hashSync(newUser.password, 10);
  try {
    const verificaUser = await db.collection(COLLECTIONS.USERS).findOne({email: email})
    if(verificaUser) {
      return res.status(STATUS_CODE.ERRORCONFLICT).send(
        `Email existente : ${email}`)
    };
    await db.collection(COLLECTIONS.USERS).insertOne(
      {name, email, password: passwordHash}
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
    const user = await db.collection(COLLECTIONS.USERS).findOne({email});
    if(user === undefined || null){
      res.status(STATUS_CODE.ERRORUNPROCESSABLEENTITY).send(
        `Usuário não encontrado (email ou senha incorretos)`
        ); 
    }
    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if(user && passwordIsValid) {
        const token = uuid();
        await db.collection(COLLECTIONS.SESSIONS).insertOne({
          userId: user._id,
          token
        })
        const legthCarts = await db.collection(COLLECTIONS.CARTS).find({email:email}).toArray().legth;
        
        const response = {token, name: user.name , email: user.email, password, legthCarts};

        res.status(STATUS_CODE.SUCCESSCREATED).send(response);
        return
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