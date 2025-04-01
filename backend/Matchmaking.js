const waitingUsers = [];

function findMatch(socket) {
    if (waitingUsers.length > 0) {
        const pairedUser = waitingUsers.pop();
        
        // Pair users together
        socket.emit("matchFound", { peerId: pairedUser.id });
        pairedUser.emit("matchFound", { peerId: socket.id });
    } else {
        // Add user to waiting list
        waitingUsers.push(socket);
    }

    socket.on("disconnect", () => {
        const index = waitingUsers.indexOf(socket);
        if (index !== -1) {
            waitingUsers.splice(index, 1);
        }
    });
}

module.exports = { findMatch };
