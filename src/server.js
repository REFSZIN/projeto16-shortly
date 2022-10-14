import express, {json} from "express";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";
import authRouters from "./routers/auth.routers.js";
import shortRouters from "./routers/short.routers.js";

dotenv.config({path:'../.env'});
const app = express();
app.use(cors());
app.use(json());

app.use(authRouters);
app.use(shortRouters);

app.listen(process.env.PORT, () => { console.log(chalk.green.bold(`Rodando ${process.env.NOMEE} Lisu on Port: ${process.env.PORT}`))});
