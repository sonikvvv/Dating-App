let socket = io();

let form = document.getElementById("form");
let input = document.getElementById("input");
let messages = document.getElementById("messages");
const authorName = document.getElementById("username").innerText;
let receiverName;
let chatID;
let authorID;
let receiverID;

socket.emit("new user", authorName);

socket.on("new user", (id) => {
    authorID = id;
});

const onUserSelected = (username) => {
    messages.innerHTML = "";
    receiverName = username;
    socket.emit("chat history", { sender: authorName, receiver: receiverName });
};

const addMessage = (msg, msgAuthor) => {
    let container = document.createElement("div");
    container.classList.add("d-flex");

    if (msgAuthor == authorID) container.classList.add("sender");
    else container.classList.add("receiver");

    let message = document.createElement("span");
    message.classList.add("badge", "bg-secondary", "text-wrap", "message");
    message.textContent = msg;

    container.appendChild(message);
    messages.appendChild(container);
};

form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (input.value) {
        let msg = input.value;
        socket.emit("message", { message: msg, author: {authorName, authorID}, receiver: {receiverName, receiverID}, chatID });
        addMessage(msg, authorID);
        input.value = "";
    }
});

socket.on("message", (data) => {
    addMessage(data.message, data.author.authorID);
    // window.scrollTo(0, document.body.scrollHeight);
});

socket.on("chat history", (chat) => {
    chatID = chat._id;
    chat.participants.forEach(id => {
        receiverID = id != authorID ? id : null;
    });

    if (chat.messages.lenght != 0){
        chat.messages.forEach( msg => {
            addMessage(msg.content, msg.sender);
        });
    }
});
