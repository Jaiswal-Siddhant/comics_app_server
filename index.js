const express = require('express');
const app = express();
const port = 8080;

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/login', (req, res) => res.send('login window!'));
app.get('/signup', (req, res) => res.send('signup window!'));
app.listen(port, () => console.log(`Example app listening on port port!`));
