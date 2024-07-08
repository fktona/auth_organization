const express = require('express');
const auth = require('./routes/auth');
const organizations = require('./routes/organizations');
const userRecord = require('./routes/userRecord');
const dotenv = require('dotenv');

dotenv.config();

const app = express(); 
app.use(express.json());


const PORT = process.env.PORT || 3000;

app.use('/auth', auth);
app.use('/api', organizations);
app.use('/api', userRecord);
if (process.env.DATABASE_URL !== 'cloud') {
  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  module.exports = { app, server };
} else {
  module.exports = { app };
}
