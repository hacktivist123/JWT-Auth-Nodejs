const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const expressjwt = require('express-jwt');

const app = express();

const PORT = process.env.API_PORT || 8080;

//For the purpose of this demo, user details will be stored in the Users array but never store user data in an array instead user data should be encrypted
const users = [
  { id: 1, username: 'sheddyxx', password: 'sheddyxx' },
  { id: 2, username: 'favour', password: 'favour' },
];

app.use(bodyParser.json());
app.use(cors());

const jwtCheck = expressjwt({
  secret: 'Secretkey',
});
app.get('/resources', (req, res) => {
  res.status(200).send('pubilc resource, you can view this');
});

app.get('/resources/secret', jwtCheck, (req, res) => {
  res.status(200).send('secret resource, you have to login to see this');
});
app.post('/login', (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).send('you need a valid username and password');
    return;
  }

  const user = users.find((u) => {
    return u.username === req.body.username && u.password === req.body.password;
  });

  if (!user) {
    res.status(401).send('User cannot be found');
  }

  const token = jwt.sign(
    {
      sub: user.id,
      username: user.username,
    },
    'Secretkey',
    { expiresIn: '20mins' }
  );

  res.status(200).send({ access_token: token });
});

app.get('/status', (req, res) => {
  const localTime = new Date().toLocaleTimeString();
  res.status(200).send(` Server time is ${localTime}`);
});

app.get('*', (req, res) => {
  res.status(404).send('Does Not Exist');
});

app.listen(PORT, () => {
  console.log(`server is live on ${PORT}.`);
});
