const http = require('http');
const app = require('./index');

// const { I18n } = require('i18n')
 
// const i18n = new I18n({
//   locales: ['en', 'pl'],
//   directory: path.join(__dirname, 'locales')
// })

const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 3300;
const server = http.createServer(app);
server.listen(port);
console.log(`Server is listening on port ${port}`);
