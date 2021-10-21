const express = require('express');
const path = require('path');
// const ViewsRoutes = require('./routes/views.routes')

const app = express();

app.set('PORT', process.env.PORT || 8000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', (req, res) => {
    res.send('<h1>hello</h1>')
});

const PORT = app.get('PORT');

app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
})