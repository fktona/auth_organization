const express = require('express');
const auth = require('./routes/auth');
const organizations = require('./routes/organizations');
const userRecord = require('./routes/userRecord');

const app = express();

app.use(express.json());

var PORT = process.env.PORT || 3000;
app.use('/auth', auth);
app.use('/api', organizations);
app.use('/api', userRecord);

  

server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports ={ app , server};


exports.app = app;