const dotenv = require('dotenv');
dotenv.config();

const app = require('./app'); 

// Start the server
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}).on('error', (err) => {
  console.error('Server error:', err);
});
