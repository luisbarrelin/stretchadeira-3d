import fs from 'node:fs/promises';
import {createServer} from 'vite';
const server=await createServer({server:{host:'127.0.0.1',port:5180,strictPort:true}});await server.listen();server.printUrls();
