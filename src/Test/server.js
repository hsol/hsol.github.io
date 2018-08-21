import 'babel-polyfill'

import 'chromedriver'
import chai from 'chai'
import chaiHttp from 'chai-http'

import path from 'path';
import express from 'express';

const app = express();
const baseDir = `${__dirname}/../../dist`.replace(/\\/, '/');

app.use(express.static(baseDir));
app.get('/', function (req, res) {
   res.sendFile(path.resolve(`${baseDir}/index.html`));
});
app.listen(3000);

chai.should();
chai.use(chaiHttp);

export default chai.request.agent(app);