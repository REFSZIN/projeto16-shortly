import { MongoClient } from 'mongodb';
import dotenv from "dotenv";
// const connection = new Pool({
//     connectionString: process.env.DATABASE_URL,
//   });
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI)

export default async function mongo () {
    let connect;
    try {
        connect = mongoClient.db(process.env.DB_NAME)
    return connect;
    } catch (error) {
        console.error("Não foi possível se conectar", error)
        return error;    
    }
}const connection = new Pool({
    connectionString: process.env.DATABASE_URL,
  });