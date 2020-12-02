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


class GameServer {
    constructor() {
        this.players = {}

        io.on("connection", (socket) => {
            this.onPlayerConnect(socket)
            this.attachListeners(socket)
            console.log("player connected")
        })
    }

    connect(port) {
        http.listen(port, () => {
            console.info(`Listening on port ${port}`);
        });
    }

    onPlayerConnect(socket) {
        socket.emit("ALL_PLAYERS", this.getAllPlayers())

        const player = this.createPlayer(socket)
        socket.emit("PROTAGONIST", player)

        socket.broadcast.emit("P_JOINED", player)

        this.players[socket.id] = player
    }

    getAllPlayers() {
        const allPlayers = []

        for (var key in this.players) {
            allPlayers.push(this.players[key])
        }

        return allPlayers
    }

    attachListeners(socket) {
        this.attachDisconectListener(socket)
        this.attachPlayerUpdateListener(socket)
        this.attachFireListener(socket)
    }

    attachFireListener(socket) {
        socket.on("FIRE", () => {
            socket.broadcast.emit("FIRE", socket.id)
        })
    }

    attachPlayerUpdateListener(socket) {
        socket.on("P_UPDATE", (player) => {
            this.players[socket.id] = player 
            socket.broadcast.emit("P_UPDATE", player)
        })
    }

    attachDisconectListener(socket) {
        socket.on('disconnect', () => {
            delete this.players[socket.id]
            socket.broadcast.emit("P_DISCONNECT", socket.id)
        });
    }

    createPlayer(socket) {
        // const positionX = this.getRandomInt(-5000, 5000)
        // const positionY = this.getRandomInt(-5000, 5000)
        
        const positionX = 600
        const positionY = 600

        const player = {
            "id": socket.id,
            "x": positionX,
            "y": positionY,
            "acceleration": 0,
        }

        return player
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

const gameServer = new GameServer()
gameServer.connect(3000)
