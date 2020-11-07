const http = require('http');
const httpProxy = require('http-proxy');
const path = require('path');
const app = require('./index');

const dotenv = require('dotenv');
dotenv.config();

httpProxy.createProxyServer({target:process.env.SERVER_URL}).listen(process.env.SERVER_PROXY);

async function server_init() {
    const port = process.env.PORT || 3300;
    const server = http.createServer(app);
    server.listen(port);
    console.log(`Server is listening on port ${port}`);
}

server_init();
