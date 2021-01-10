const http = require('http');
const path = require('path');
const app = require('./index');

//const { I18n } = require('i18n')
 
//const i18n = new I18n({
// locales: ['en', 'pl'],
//  directory: path.join(__dirname, 'locales')
//})

const options = {
  key: fs.readFileSync('web-organizer.org.pl.crt'),
  cert: fs.readFileSync('web-organizer.org.pl.key')
};

async function server_init() {
    const port = process.env.PORT || 3300;
    const server = http.createServer(options, app);
    server.listen(port);
    console.log(`Server is listening on port ${port}`);
}

server_init();
