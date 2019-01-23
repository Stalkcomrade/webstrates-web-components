// const userId = 'cklokmose:github' //webstrate.user.userId;
// const userId = 'Stalkcomrade:github'

// SOLVED: Promise for userID? - works without workarounds
const userId = webstrate.user.userId // const userId = 'Stalkcomrade:github'
console.dir("WS User ID:")
console.dir(userId)

// SOLVED: identify server

var getServer = function() {
    
    if (window.location.href.indexOf("webstrates.r2.enst.fr") > -1) {
        var serverAddress = 'https://webstrates.r2.enst.fr/'
    } else {
        var serverAddress = 'https://webstrates.cs.au.dk/'
    }
    
    return serverAddress
}

var checkServer = function(serverAddress) {
    
    if (serverAddress === "https://webstrates.cs.au.dk/") {
        var wsLocal = new WebSocket('wss://webstrates.cs.au.dk/_monitor')
    } else {
        var wsLocal = new WebSocket('wss://webstrates.r2.enst.fr/_monitor')
    }

    return wsLocal
}

const serverAddress = window.serverAddress = getServer()
const ws = checkServer(serverAddress)

// SOLVED: redirect ti github for auth
// TODO: ask for redirection back to ws (backend?)

var watchAuth = function(serverAddress) {
    serverAddress === "https://webstrates.cs.au.dk/" && window.location.replace("https://webstrates.cs.au.dk/auth/github")
}

userId === "anonymous:" && watchAuth()

// const ws = new WebSocket('wss://webstrates.cs.au.dk/_monitor');
// Generate random string to be used as tokens.
const randomString = () => Math.random().toString(36).substring(2);

// Map from tokens to promises.
const promises = new Map();

// Every 25 second or so we send a ping message to keep the connection alive.
let interval;
ws.onopen = (e) => {
    setInterval(() => {
        sendMsg({
            type: 'ping'
        });
    }, 25 * 1000);
};

ws.onclose = (e) => {
    clearInterval(interval);
};

// This is where we handle incoming messages!
ws.onmessage = (msg) => {
    msg = JSON.parse(msg.data);

    // We set a token on messages we expect an answer to. This token is included in the answer we get
    // from the server. Or it should be. If it isn't there, we don't know what the message is an
    // answer to, so we toss it out.
    if (!msg.token) {
        console.error('Received msg without token', msg);
        return;
    }

    // promises is a map from tokens to callbacks. If there's no callback associated with the token we
    // got back, we can't do anything with the answer, so we toss it out.
    if (!promises.has(msg.token)) {
        console.error('Found no callback for token', msg);
        return;
    }

    // Finally! If there's a token and it belongs to a callback, we call the callback with the answer
    // from the server.
    const [resolve, reject] = promises.get(msg.token);
    promises.delete(msg.token);
    resolve(msg.payload);
};

const sendMsg = (msg) => {
    switch (ws.readyState) {

        // If the websocket is about to connect, we wait 100 ms and try again.
        case WebSocket.CONNECTING:
            {
                setTimeout(sendMsg, 100, msg);
                break;
            }

            // If the websocket is open and ready to use, we send the message as requested.
        case WebSocket.OPEN:
            {
                ws.send(JSON.stringify(msg));
                break;
            }

            // If the websocket is closing or closed, we throw an error.
        case WebSocket.CLOSING:
        case WebSocket.CLOSED:
            {
                throw new Error('Websocket closing');
            }

    }
};

const dataFetcher = window.dataFetcher = (type, options) => new Promise((resolve, reject) => {
    const token = randomString();
    promises.set(token, [resolve, reject]);
    sendMsg({
        type,
        token,
        options,
        userId
    });
});
