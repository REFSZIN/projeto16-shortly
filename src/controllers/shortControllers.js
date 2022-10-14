import connection from '../db/db.js';
import { STATUS_CODE } from '../enums/statusCode.js';
import { COLLECTIONS } from '../enums/collections.js';
import { schemaCheckout,schemaCart } from '../schemas/shortSchemas.js';

const shortLink = async (req, res) =>{
  try {
      const products = await db.collection(COLLECTIONS.PRODUCTS).find().toArray();
      return res.send(products);
  } catch (error) {
      console.error(error);
      return res.sendStatus(STATUS_CODE.SERVERERRORINTERNAL);
  };
};

const showShort = async (req, res) =>{
  const {product, email } = req.body;
  const cart = {product,email};
  const valid = schemaCart.validate(cart, {abortEarly: false});

  if(valid.errorMessage){
    const erros = validation.error.details.map((err) => err.message);
    res.status(STATUS_CODE.ERRORUNPROCESSABLEENTITY).send(
      `Todos os campos são obrigatórios! : ${erros}`
      ); 
    return
  };

  try {
      await db.collection(COLLECTIONS.CARTS).insertOne({
        product,email
      });
      return res.sendStatus(200);
  } catch (error) {
      console.error(error);
      return res.sendStatus(STATUS_CODE.SERVERERRORINTERNAL);
  }
};

const openShort = async (req, res) =>{
  const { email } = req.body;
  try {
      const myCart = await db.collection(COLLECTIONS.CARTS).find(email).toArray();
      return res.send(myCart);
  } catch (error) {
      console.error(error);
      return res.sendStatus(STATUS_CODE.SERVERERRORINTERNAL);
  };
};

const deleteShort = async (req, res) =>{
  const { ID } = req.params;
  try {
      const message = await db.collection(COLLECTIONS.CARTS).findOne({_id: ObjectId(`${ID}`)});
    if(!message){
      return res.sendStatus(STATUS_CODE.ERRORNOTFOUND);
    }
    await db.collection(COLLECTIONS.CARTS).deleteOne({_id: ObjectId(`${ID}`)});
    res.sendStatus(STATUS_CODE.SUCCESSOK);
  } catch(e) {
      res.status(STATUS_CODE.SERVERERRORINTERNAL).send({errorMessage: `Não foi possível deletar! Causa: ${e}`});
  }
};

const listShortUsers = async (req, res) =>{
  const { user } = res.locals;
  try {
      const checkout = await db.collection(COLLECTIONS.CHECKOUTS).find({email: user.email});
  if(!checkout){
      return res.sendStatus(STATUS_CODE.ERRORNOTFOUND);
  }
      return res.send(checkout);
  } catch(e) {
      res.status(STATUS_CODE.SERVERERRORINTERNAL).send({errorMessage: `Não foi possível fazer Checkout! Causa: ${e}`});
  }
};

const showRanking = async (req, res) =>{
  const { user } = res.locals;

  const{
    email,
    cep,
    number,
    state,
    district,
    city,
    payMethod,
    request,
    price} = req.body;

  const pedido ={   
    user,
    email,
    cep,
    number,
    state,
    district,
    city,
    payMethod,
    request,
    price
  };

  const valid = schemaCheckout.validate(pedido, {abortEarly: false});

  if(valid.errorMessage){
    const erros = validation.error.details.map((err) => err.message);
    res.status(STATUS_CODE.ERRORUNPROCESSABLEENTITY).send(
      `Todos os campos são obrigatórios! : ${erros}`
      ); 
    return
  };

  try {
      const finalcart = await db.collection(COLLECTIONS.CARTS).find({email: email});
  
  if(!finalcart){
      return res.sendStatus(STATUS_CODE.ERRORNOTFOUND);
  }
      await db.collection(COLLECTIONS.CHECKOUTS).insertOne({pedido});
      await db.collection(COLLECTIONS.CARTS).deleteMany({email: email});
      res.sendStatus(STATUS_CODE.SUCCESSOK);
  } catch(e) {
      res.status(STATUS_CODE.SERVERERRORINTERNAL).send({errorMessage: `Não foi possível fazer Checkout! Causa: ${e}`});
  }
};

export {showRanking,listShortUsers,deleteShort,openShort,showShort,shortLink };