const http = require('http');
const app = require('./index');

async function server_init() {
    const port = process.env.PORT || 3300;
    const server = http.createServer(app);
    server.listen(port);
    console.log(`Server is listening on port ${port}`);
}

server_init();
// mongo_connection().catch(console.error);
