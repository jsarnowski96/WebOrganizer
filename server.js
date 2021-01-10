const http = require('http');
const path = require('path');
const fs = require('fs');
const app = require('./index');

//const { I18n } = require('i18n')
 
//const i18n = new I18n({
// locales: ['en', 'pl'],
//  directory: path.join(__dirname, 'locales')
//})

async function server_init() {
    const port = process.env.PORT || 443;
    const server = http.createServer({
       key: fs.readFileSync('web-organizer.org.pl.crt'),
       cert: fs.readFileSync('web-organizer.org.pl.key')
    }, app);
    server.listen(port);
    console.log(`Server is listening on port ${port}`);
}

server_init();
