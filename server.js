const http = require('http');
const app = require('./index');

async function server_init() {
    const port = process.env.port || 3300;
    const server = http.createServer(app);
    server.listen(port);
}

server_init();
// mongo_connection().catch(console.error);
