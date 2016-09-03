var io = require("socket.io-client");

var ServerBaseUrl = "http://localhost:3700/";
//var ServerBaseUrl = "http://ec2-52-58-212-143.eu-central-1.compute.amazonaws.com/";
var socket = io.connect(ServerBaseUrl);


var PossibleActions = {
    pleaseIdentifyYourself : 'pleaseIdentifyYourself',      // The server will send this to the client
    takeMySocialIdentity : 'takeMySocialIdentity',          // The client first sends this to the server
    takeVideosBeingWatched : 'takeVideosBeingWatched',      // The server then sends this to the client

    newFriendInstalledTubePeek : 'newFriendInstalledTubePeek',
    friendUninstalledTubePeek : 'friendUninstalledTubePeek',

    userChangedOnlineStatus : 'userChangedOnlineStatus',
    takeFriendOnlineStatus : 'takeFriendOnlineStatus',

    changedVideo : 'changedVideo',
    takeFriendVideoChange : 'takeFriendVideoChange',

    acknowledge : "acknowledge"
};

if(socket) {
    socket.on('message', function (data) {
        console.log("\nData gotten: " + JSON.stringify(data));
        actOnServerMessage(data);
    });

    socket.on('disconnect', function() {
        console.log("Socket.io Connection with server lost!");
    });
}

// Here you can use the details of your own friends
var usersToPlayWith = [
    {
        authData : {
            "uid" : "107870964512523715119",
            "fullName":"Joseph Benson - Aruna",
            "emailAddress":"joebaruna@gmail.com",
            "accessToken":"",
            "accessTokenExpiry":"",
            "imageUrl":"https://lh3.googleusercontent.com/-2QdI3W5d41Y/AAAAAAAAAAI/AAAAAAAADUQ/q96HDWYFHCs/photo.jpg?sz=50"
        },
        friends: {
            // "105780673981511269670" : {
            //     fullName : "Efe Ariaroo",
            //     imageUrl : ""
            // }
        }
    }
    // ,
    // {
    //     authData : {
    //         "uid" : "106300473125144387782",
    //         "fullName":"Akinwale Ifaniyi",
    //         "emailAddress":"waleifaniyi@gmail.com",
    //         "accessToken":"",
    //         "accessTokenExpiry":"",
    //         "imageUrl":"https://lh5.googleusercontent.com/-49Hchfm-Ti8/AAAAAAAAAAI/AAAAAAAAAU4/H3XoEbmtQXw/photo.jpg?sz=50"
    //     },
    //     friends: {
    //         // "105780673981511269670" : {
    //         //     fullName : "Efe Ariaroo",
    //         //     imageUrl : ""
    //         // }
    //     }
    // }
];

var vidUrlsToChooseFrom = [
    "https://www.youtube.com/watch?v=YmSVji6uzzw",
    "https://www.youtube.com/watch?v=RozWiUA-GCk",
    "https://www.youtube.com/watch?v=r5TJYhZeZs8",
    "https://www.youtube.com/watch?v=NOfKyjyWiU0",
    "https://www.youtube.com/watch?v=EB4MYGInRl4",
    "https://www.youtube.com/watch?v=YpEFYDkpXE0&t=1440s",
    "https://www.youtube.com/watch?v=fklep3sUSWo"
];

function actOnServerMessage(messageData) {
    var action = messageData.action || "";

    if(action === PossibleActions.pleaseIdentifyYourself) {
        console.log("Will identity myself");
        for (var i = 0; i < usersToPlayWith.length; i++) {
            var dataToSendToServer = {
                action : PossibleActions.takeMySocialIdentity,
                provider : "google",
                authData : usersToPlayWith[i].authData,
                friends : usersToPlayWith[i].friends
            };
            if(socket && socket.connected) {
                socket.emit('send', dataToSendToServer);
            }
        }
    } else if(action == PossibleActions.takeVideosBeingWatched) {
        takeVideosBeingWatched(messageData);
    } else if (action === PossibleActions.takeFriendOnlineStatus) {
        console.log("Got takeFriendOnlineStatus! " + JSON.stringify(messageData));
    }
}

function takeVideosBeingWatched(messageData) {
    var friendsVideos = messageData.friendsOnYoutube;
    var friendsOnTubePeek = messageData.friendsOnTubePeek;

    if(friendsOnTubePeek && Object.keys(friendsOnTubePeek).length > 0) {
        if(socket && socket.connected) {
            sendVideoChange(socket);
        }
    } else {
        console.log("Number of friends who installed TubePeek: 0");
    }
}

function sendVideoChange (socket) {
    (function myLoop (indexOfVideo) {
        setTimeout(function () {
            if (indexOfVideo >= 0) {
                var userIndex = Math.floor(Math.random() * usersToPlayWith.length);

                var dataToSendToServer = {
                    action : PossibleActions.changedVideo,
                    googleUserId : usersToPlayWith[userIndex].authData.uid,
                    videoUrl : vidUrlsToChooseFrom[indexOfVideo]
                };
                console.log("\nData sent to the server: \n" + JSON.stringify(dataToSendToServer) + "\n");
                socket.emit('send', dataToSendToServer);

                myLoop(--indexOfVideo);
            } //else
                //goOffline(socket);
        }, 5000);
    })(vidUrlsToChooseFrom.length - 1);
}

function goOffline (socket) {
    for (var i = 0; i < usersToPlayWith.length; ++i) {
        var dataToSendToServer = {
            action : PossibleActions.userChangedOnlineStatus,
            userEmail : usersToPlayWith[i].authData.emailAddress,
            onlineState : false
        };
        socket.emit('send', dataToSendToServer);
    }
}
