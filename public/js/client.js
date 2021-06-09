let socket = io();

let form = document.getElementById("form");
let input = document.getElementById("input");
let messages = document.getElementById("messages");
const authorName = document
    .getElementById("username")
    .innerText.replace(" ", "");
let receiverName;
let chatID;
let authorID;
let receiverID;

socket.emit("new user", authorName);

socket.on("new user", (id) => {
    authorID = id;
});

const onUserSelected = (username, element) => {
    messages.innerHTML = "";
    receiverName = username;

    const cards = document.querySelectorAll(".chat_card");
    console.log(cards);

    cards.forEach(card => {
        if(card.classList.contains("chat_card_selected")) {
            card.classList.remove("chat_card_selected");
        }
    });

    element.classList.add("chat_card_selected");

    socket.emit("chat history", { sender: authorName, receiver: receiverName });
};

const addMessage = (msg, msgAuthor) => {
    let container = document.createElement("div");
    container.classList.add("d-flex", "my-2");

    if (msgAuthor == authorID) container.classList.add("sender");
    else container.classList.add("receiver");

    let message = document.createElement("span");
    message.classList.add("badge", "bg-secondary", "text-wrap", "message");
    message.textContent = msg;

    container.appendChild(message);
    messages.appendChild(container);
    messages.scrollTo(0, messages.scrollHeight);
};

form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (input.value) {
        let msg = input.value;
        socket.emit("message", {
            message: msg,
            author: { authorName, authorID },
            receiver: { receiverName, receiverID },
            chatID,
        });
        addMessage(msg, authorID);
        input.value = "";
    }
});

socket.on("message", (data) => {
    addMessage(data.message, data.author.authorID);
});

socket.on("chat history", (chat) => {
    chatID = chat._id;
    chat.participants.forEach((id) => {
        receiverID = id != authorID ? id : null;
    });

    if (chat.messages.length != 0) {
        chat.messages.forEach((msg) => {
            addMessage(msg.content, msg.sender);
        });
    }
});
