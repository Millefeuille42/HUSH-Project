var socket

//function openSocket() {
    try {
        socket = new WebSocket("ws://localhost:8080")
    } catch (exception) {
        console.error(exception)
    }

    socket.onerror = function(error) {
        console.error(error);
    };

    socket.onopen = function(event) {
        console.log("Connexion établie.");
    };

    socket.onclose = function(event) {
        console.log("Connexion terminé.");
    };

    socket.onmessage = function(event) {
        var message = JSON.parse(event.data)
        console.log(message.name + " -> " + message.text);
        printMessage(message.name + ": " + message.text);
    };

//}

function sendMessage() {
    var message =  {
        text: document.getElementById("input").value,
        name : document.getElementById("name").value
    }

    var messageJson = JSON.stringify(message)

    socket.send(messageJson)
}

function printMessage(message) {
    var dv = document.createElement("div")
    var otp = document.getElementById("output")

    dv.innerHTML = message
    otp.appendChild(dv)
}