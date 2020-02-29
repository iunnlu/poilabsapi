const express = require('express');
const app = express();
const cors = require('cors');
const pointsRoute = require('./routes/points');

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Welcome to poilabs api!');
})

app.use(cors());

app.use(express.json());
app.use('/api', pointsRoute);

app.listen(PORT, () => console.log('Server is running on 3000 port!'));

module.exports = app;