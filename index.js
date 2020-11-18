const express = require("express")
const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const port = 3000
const path = require("path")
var favicon = require('serve-favicon');

let players = []

app.use(express.static('public'))
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/index.html"))
})

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on("new_player", (player) => {
        player.id = socket.id
        players.push(player)
        socket.emit("all_players", players)
    })

    socket.on("player_update", (player) => {
        for (let i = 0; i < players.length; i++) {
            if (players[i].id == socket.id) {
                players[i].x = player.x
                players[i].y = player.y
                players[i].rotation = player.rotation
                
                break;
            }
        }

        socket.broadcast.emit("player_update", player)
    })

    socket.on('disconnect', () => {
        const allPlayers = []
        for (let i = 0; i < players.length; i++) {
            if (players[i].id != socket.id) {
                allPlayers.push(players[i])
            }
        }
        players = allPlayers;
        io.emit("all_players", players)
    });
});


http.listen(3000, () => {
  console.log('listening on *:3000');
});



