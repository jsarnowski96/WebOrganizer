const http = require('http');
<<<<<<< HEAD
const app = require('./index');

// const { I18n } = require('i18n')
 
// const i18n = new I18n({
//   locales: ['en', 'pl'],
//   directory: path.join(__dirname, 'locales')
// })

const dotenv = require('dotenv');
dotenv.config();
=======
const path = require('path');
const fs = require('fs');
const app = require('./index');

//const { I18n } = require('i18n')
 
//const i18n = new I18n({
// locales: ['en', 'pl'],
//  directory: path.join(__dirname, 'locales')
//})

async function server_init() {
    const port = process.env.PORT || 3300;
    const server = http.createServer({
       key: fs.readFileSync('web-organizer.org.pl.crt'),
       cert: fs.readFileSync('web-organizer.org.pl.key')
    }, app);
    server.listen(port);
    console.log(`Server is listening on port ${port}`);
}
>>>>>>> 102f0ae9680da9d0809e2eca65022e1f004415a0

const port = process.env.PORT || 3300;
const server = http.createServer(app);
server.listen(port);
console.log(`Server is listening on port ${port}`);
