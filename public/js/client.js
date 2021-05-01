let socket = io();

let form = document.getElementById('form');
let input = document.getElementById('input');
let messages = document.getElementById('messages');
const author = document.getElementById('username').innerHTML;
let reciever;

socket.emit('newUser', author);

const onUserSelected = (username) => {
    reciever = username;
    // socket.emit('chat history', {chatID: 30, reciever: author});
};
const addMessage = (msg, author) => {
    let item = document.createElement('li');
    item.textContent = `${author}: ${msg}`;
    messages.appendChild(item);
};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        let msg = input.value;
        socket.emit('message', { msg, author, reciever });
        addMessage(msg, author);
        input.value = '';
    }
});

socket.on('message', (data) => {
    addMessage(data.msg, data.author);
    // window.scrollTo(0, document.body.scrollHeight);
});
