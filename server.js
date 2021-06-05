const http = require('http');
const app = require('./index');

const dotenv = require('dotenv');
dotenv.config();

async function server_init() {
    const port = process.env.PORT || 2087;
    const server = http.createServer(app);
    server.listen(port);
    console.log(`Server is listening on port ${port}`);
}

await server_init();
