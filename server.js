const express = require('express');
const ejsMate = require('ejs-mate');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const app = express();
const server = require('http').createServer(app);
const badges = require('./routes/badges');
const rules = require('./routes/rules');
const tags = require('./routes/tags');
const users = require('./routes/users');
const chats = require('./routes/chats');
const discover = require('./routes/discover');
const register = require('./routes/register');
const login = require('./routes/login');
const ExpressError = require('./utils/ExpressError');
const io = require('socket.io')(server);

mongoose.connect('mongodb://localhost:27017/dating-app', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {
    console.log('Database connected.');
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('home');
});

////

app.use('/badges', badges);
app.use('/rules', rules);
app.use('/tags', tags);
app.use('/users', users);
app.use('/chats', chats);
app.use('/discover', discover);
app.use('/register', register);
app.use('/login', login);

////

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.broadcast.emit('hi');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
    });
});

////

app.all('*', (req, res, next) => {
    // next(new ExpressError('Page Not Found', 404));
    res.status(404).send('Page Not Found');
});

server.listen(3000, () => {
    console.log('Server started on port 3000.');
});
