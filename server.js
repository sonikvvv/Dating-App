const express = require('express');
const ejsMate = require('ejs-mate');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const app = express();
const server = require('http').createServer(app);
const ExpressError = require('./utils/ExpressError');
const io = require('socket.io')(server);
const session = require('express-session');


//* routs
const badges = require('./routes/badges');
const rules = require('./routes/rules');
const tags = require('./routes/tags');
const users = require('./routes/users');
const chats = require('./routes/chats');
const discover = require('./routes/discover');
const register = require('./routes/register');
const login = require('./routes/login');


//* db connection
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


//* settings
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));


//* session settings
const sessionConfig = {
    secret: 'this-shoud-be-a-secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};
app.use(session(sessionConfig));


//* routs
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
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});

////

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500} = err;
    if(!err.message) err.message = 'Something went wrong!';
    res.status(statusCode).render('error', { err });
});

server.listen(3000, () => {
    console.log('Server started on port 3000.');
});
