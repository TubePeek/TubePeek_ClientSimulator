var io = require("socket.io-client");

var ServerBaseUrl = "http://localhost:3700/";
var socket = io.connect(ServerBaseUrl);

var PossibleActions = {
    pleaseIdentifyYourself : 'pleaseIdentifyYourself',      // The server will send this to the client
    takeMySocialIdentity : 'takeMySocialIdentity',          // The client first sends this to the server
    takeVideosBeingWatched : 'takeVideosBeingWatched',      // The server then sends this to the client

    userChangedOnlineStatus : 'userChangedOnlineStatus',
    takeFriendOnlineStatus : 'takeFriendOnlineStatus',

    changedVideo : 'changedVideo',
    takeFriendVideoChange : 'takeFriendVideoChange',

    acknowledge : "acknowledge"
};

if(socket) {
    socket.on('message', function (data) {
        console.log("Data gotten: " + JSON.stringify(data));
        actOnServerMessage(data);
    });

    socket.on('disconnect', function() {
        console.log("Socket.io Connection with server lost!");
    });
}

function actOnServerMessage(messageData) {
    var action = messageData.action || "";

    if(action === PossibleActions.pleaseIdentifyYourself) {
        console.log("Will identity myself");
        var dataToSendToServer = {
            "action" : "takeMySocialIdentity",
            "provider" : "google",
            "authData" : {
                "uid" : "105780673981511269670",
                "fullName":"Efe Ariaroo Dummy",
                "emailAddress":"efeariaroo1@gmail.com",
                "accessToken":"ya29.CjRAA_K_QBoNBpJprCT35XSY",
                "accessTokenExpiry":"3600",
                "imageUrl":"https://lh3.googleusercontent.com/-rVWQOfwty1I/AAAAAAAAAAI/AAAAAAAAAbQ/nLLEBefPIKo/photo.jpg?sz=50"
            },
            friends : {}
        }
        if(socket && socket.connected) {
            socket.emit('send', dataToSendToServer);
        }
    } else {

    }
}
