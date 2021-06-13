if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const ejsMate = require("ejs-mate");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const app = express();
const server = require("http").createServer(app);
const ExpressError = require("./utils/ExpressError");
const io = require("socket.io")(server);
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./utils/models/userModel");
const Chat = require("./utils/models/chatModel");
const Message = require("./utils/models/messageModel");
const MongoDBStore = require("connect-mongo");

//* routs
const tagsRoutes = require("./routes/tags");
const usersRoutes = require("./routes/users");
const settingsRoutes = require("./routes/settings");

//* db connection
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/dating-app";
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
    console.log("Database connected.");
});

//* settings
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

//* session settings
const secret = process.env.SECRET || "this-should-be-a-secret";
const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    autoRemove: 'native',
    touchAfter: 24 * 60 * 60,
    secret
});

store.on("error", function (e) {
    console.log("Session store error", e);
})

const sessionConfig = {
    store,
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};
app.use(session(sessionConfig));

//* Authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//* Flash(for fancy popup messages)
app.use(flash());

app.use((req, res, next) => {
    res.locals.currentUser = req.user || null;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

//* routs
app.get("/", (req, res) => {
    res.render("home");
});

app.use("/tags", tagsRoutes);
app.use("/users", usersRoutes);
app.use("/settings", settingsRoutes);

//* chats
let chatUsers = [];

io.on("connection", (socket) => {
    // console.log("a user connected");
    socket.on("disconnect", () => {
        // console.log("user disconnected");
    });

    socket.on("new user", async (username) => {
        const user = await User.findOne({ username });
        chatUsers[username] = { socket: socket.id, userId: user._id };
        io.to(socket.id).emit("new user", user._id);
    });

    socket.on("chat history", async (data) => {
        const senderSocket = chatUsers[data.sender].socket;
        const chatParticipants = await User.find({
            username: { $in: [data.sender, data.receiver] },
        });

        let chatId;

        if (chatParticipants[0].liked.length !== 0) {
            chatParticipants[0].liked.forEach((chat) => {
                if (chat.userId == chatParticipants[1]._id.toString()) {
                    chatId = chat.chatId;
                }
            });
        }

        const chat = await Chat.findById(chatId).populate("messages");

        io.to(senderSocket).emit("chat history", chat);
    });

    socket.on("message", async (data) => {
        const { message, author, receiver, chatID } = data;

        const receiverSocket = chatUsers[receiver.receiverName]
            ? chatUsers[receiver.receiverName].socket
            : null;

        if (receiverSocket) {
            io.to(receiverSocket).emit("message", data);
        }

        const msg = new Message({
            sender: author.authorID,
            receiver: receiver.receiverID,
            content: message,
        });

        msg.save();

        const chat = await Chat.findById(chatID);
        chat.messages.push(msg._id);
        await Chat.findByIdAndUpdate(chat._id, { ...chat });
    });
});

//* errors
app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong!";
    res.status(statusCode).render("error", { err });
});

//* port
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server started on port ${port}.`);
});
