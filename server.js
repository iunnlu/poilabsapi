const express = require('express');
const app = express();
const pointsRoute = require('./routes/points');
const cors = require('cors');

app.get('/', (req, res) => {
    res.send('Welcome to poilabs api!');
})

app.use(cors());

app.use(express.json())
app.use('/api', pointsRoute);

app.listen(process.env.PORT || 3000, () => console.log('Server is running on 3001 port!'));