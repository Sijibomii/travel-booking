const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const {notFound} = require('./api/middlewares/notFound');
const {errorHandler} = require('./api/middlewares/errorHandler');
//create notfound and errorHandler in separate files
const api = require('./api/index');
const app = express();

app.use(morgan('tiny'));
app.use(compression());
app.use(helmet());
app.use(express.json());
const port = process.env.PORT || 5000;
app.listen(port, () => {
console.log(`Listening at http://localhost:${port}`);
});
app.use('/api/v1', api);
app.use(notFound);
app.use(errorHandler);

