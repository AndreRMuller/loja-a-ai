
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { Usuario } from './modal/Usuario';
import { Produto } from './modal/produto';
import { client, dbQuery } from './database';


const port: Number = 3000;
let server: Express = express();

server.use(cors());
server.use(express.json());


