const User = require("../utils/models/userModel");
const { ObjectId } = require("mongodb");
const Chat = require("../utils/models/chatModel");

module.exports.renderAllUsers = async (req, res) => {
    const users = await User.find({});
    res.render("users/users", { users });
};

module.exports.renderLogin = (req, res) => {
    res.render("users/log-reg/login");
};

module.exports.login = (req, res) => {
    const user = req.user;
    req.flash("success", `Welcome back ${user.username}!`);
    const redirect = req.session.returnTo || "/users/discover";
    res.redirect(redirect);
};

module.exports.logout = (req, res) => {
    req.logout();
    req.flash("success", "Goodbye!");
    res.redirect("/");
};

module.exports.renderRegister = (req, res) => {
    res.render("users/log-reg/register");
};

module.exports.register = async (req, res) => {
    try {
        const { email, username, password, years } = req.body.user;
        const user = new User({ email, username, years });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to BlindDatee!");
            res.redirect(`/users/${user._id}`);
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/users/register");
    }
};

module.exports.renderChats = async (req, res) => {
    let chatUserIds = [];

    req.user.liked.forEach((el) => {
        if (el.chatId) {
            chatUserIds.push(el.userId);
        }
    });

    let users = await User.find({ _id: { $in: chatUserIds } });
    res.render("users/chats/chatsPage", { users });
};

module.exports.renderDiscover = async (req, res) => {
    const filter = req.user.filter;
    let exclude = [];
    exclude.push(ObjectId(req.user._id));

    req.user.liked.forEach((el) => {
        exclude.push(ObjectId(el.userId));
    });

    req.user.disliked.forEach((el) => {
        exclude.push(ObjectId(el));
    });

    let excludeFilter = {};
    excludeFilter._id = { $nin: exclude };
    if (filter.years.years_from && filter.years.years_to) {
        excludeFilter.years = {
            $gte: filter.years.years_from,
            $lte: filter.years.years_to,
        };
    }
    if (filter.sex || filter.sex != "") excludeFilter.sex = filter.sex;
    if (filter.user_orientation || filter.user_orientation != "")
        excludeFilter.orientation = filter.user_orientation;
    if (filter.relationshipStatus || filter.relationshipStatus != "")
        excludeFilter.relationshipStatus = filter.relationshipStatus;
    if (filter.bodyType || filter.bodyType != "")
        excludeFilter.bodyType = filter.bodyType;

    const user = await User.findOne(excludeFilter)
        .populate("images")
        .populate("tags");
    res.render("users/discover/discoverPage", { user });
};

module.exports.discover = async (req, res) => {
    const { id, liked } = req.params;
    const user = req.user;

    if (liked == "true") {
        const likedUser = await User.findById(id);
        if (likedUser.liked.length != 0) {
            for (let index = 0; index < likedUser.liked.length; index++) {
                const element = likedUser.liked[index];
                if (element.userId.equals(user._id)) {
                    const chat = new Chat();
                    chat.participants.push(user._id, id);
                    chat.save();

                    user.liked.push({ userId: id, chatId: chat._id });
                    likedUser.liked[index].chatId = chat._id;

                    await User.findByIdAndUpdate(id, { ...likedUser });

                    req.flash("success", "You have a match!");
                    break;
                }
            }
        } else {
            user.liked.push({ userId: id });
            await User.findByIdAndUpdate(user._id, { ...user });
        }
    } else user.disliked.push(id);

    await User.findByIdAndUpdate(user._id, { ...user });
    res.redirect("/users/discover");
};

module.exports.renderUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).populate("tags");
    res.render("users/userPage", { user });
};

module.exports.renderEditUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    res.render("users/edit", { user });
};

module.exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { ...req.body.user });
    res.render("users/userPage", { user });
};

module.exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    res.redirect("/users");
};
