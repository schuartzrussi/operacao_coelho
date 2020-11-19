class GameScene extends Phaser.Scene {

    MAX_ASTEROIDS = 300; 

    constructor() {
        super({
            key: 'gameScene'
        });
    }

    preload() {
        this.load.image('background', 'images/background.jpg')
        this.load.image('ship', 'images/ship.png')
        this.load.image('laser', 'images/rotated_laser.png')
        this.load.image('item_ammo', 'images/item_ammo.png')
        this.load.spritesheet("asteroid", "images/asteroids.png", { frameWidth: 128, frameHeight: 128 });
        this.load.atlas('particles', 'images/particles.png', 'images/particles.json');
    }

    create() {
        this.enemyMap = {}
        this.gameStarted = false;
        this.eventsReceived = 0;
        this.socket = io();
        const self = this;

        this.socket.on('PROTAGONIST', (player) => {
            self.protagonist = player;
            self.eventsReceived ++;

            console.log(`received protagonist: ${player}`)
            if (self.eventsReceived >= 2) {
                self.playerConnected()
            }
        });

        this.socket.on('ALL_PLAYERS', (players) => {
            self.allPlayers = players;
            self.eventsReceived ++;

            console.log(`received all players: ${players}`)
            if (self.eventsReceived >= 2) {
                self.playerConnected()
            }
        });

        this.socket.on('P_JOINED', (player) => {
            self.createEnemy(player)
        })

        this.socket.on("P_UPDATE", (player) => {
            console.log(`Player updated ${player.id}`)
            if (self.enemyMap[player.id] != undefined) {
                const enemy = self.enemyMap[player.id]
                enemy.sprite.x = player.x
                enemy.sprite.y = player.y
                enemy.sprite.body.setAngularDrag(player.rotation)
            }
        })

        this.socket.on('P_DISCONNECT', (id) => {
            console.log(`Player ${id} disconnected`)
            delete self.enemyMap[id]
        })
    }

    playerConnected() {
        console.log("game started")

        this.lastUpdate = null;

        this.windowWidth = window.innerWidth * window.devicePixelRatio
        this.windowHeight = window.innerHeight * window.devicePixelRatio
        this.bg = this.add.tileSprite(this.windowWidth / 2, this.windowHeight / 2, this.windowWidth, this.windowHeight, 'background').setScrollFactor(0);
        
        this.createAnimations();

        const self = this;

        this.ship = new Ship(this, this.protagonist.x, this.protagonist.y, function () {
            self.gameInfo.onUpdateBullets(self.ship.bullets)
        });

        this.asteroidsGroup = this.physics.add.group({
            classType: Asteroid,
            runChildUpdate: true,
            removeCallback: function() {
                self.qtdAsteroids --;
            }
        });

        this.itemsGroup = this.physics.add.group({
            classType: Item,
            runChildUpdate: true,
        });

        this.explosionParticles = this.add.particles("particles")

        this.physics.add.collider(this.ship.lasers, this.asteroidsGroup, function (laser, asteroid) {
            asteroid.addDamage(laser.power) 
            if (asteroid.life <= 0) {
                asteroid.destroy()
                self.showExplosion(asteroid.x, asteroid.y)
                self.cameras.main.shake(200, 0.01);

                if (Math.random() > 0.1) {
                    const item = new Item(self, ITEM_AMMO, asteroid.x, asteroid.y)
                    self.itemsGroup.add(item, true)
                }
            }
            laser.destroy()
        })

        this.physics.add.collider(this.ship.sprite, this.asteroidsGroup);

        this.physics.add.collider(this.ship.sprite, this.itemsGroup, function (ship, item) {
            if (item.type == ITEM_AMMO && self.ship.bullets <= 100) {
                self.ship.bullets += 10;
                if (self.ship.bullets > 100) {
                    self.ship.bullets = 100;
                }
                self.gameInfo.onUpdateBullets(self.ship.bullets)
                item.destroy()
            }
        })

        this.cameras.main.startFollow(this.ship.sprite);
        this.physics.world.setBounds(-5000, -5000, 10000, 10000);
        
        this.qtdAsteroids = 0;

        this.gameInfo = new Info(this, this.ship.bullets, this.windowWidth, this.windowHeight)

        for (let i = 0; i < this.MAX_ASTEROIDS; i++) {
            this.createAsteroid()
            this.qtdAsteroids++
        }

        this.gameStarted = true;

        /*
        this.socket.on('connect', () => {
            this.socket.emit('new_player', {
                'x': this.ship.sprite.x, 
                'y': this.ship.sprite.y,
                'rotation': this.ship.sprite.rotation
            });
        });

        this.socket.on('all_players', (players) => {
            for (let i = 0; i < players.length; i++) {
                if (players[i].id != this.socket.id) {
                    let enemy = new Enemy(
                        this, 
                        players[i].id, 
                        players[i].x, 
                        players[i].y, 
                        players[i].rotation
                    )

                    this.enemys.push(enemy);
                }
            }
        });

        this.socket.on("player_update", (player) => {
            for (let j = 0; j < this.enemys.length;j++) {
                if (player.id == this.enemys[j].id) {
                    this.enemys[j].sprite.x = player.x
                    this.enemys[j].sprite.y = player.y
                    this.enemys[j].sprite.body.setAngularDrag(player.rotation)
                }
            }
        })
        */

        if (this.allPlayers != undefined && this.allPlayers.length > 0) {
            this.allPlayers.forEach(player => {
               self.createEnemy(player)
            }) 
        }
    }

    createEnemy(player) {
        let enemy = new Enemy(
            this, 
            player.id, 
            player.x, 
            player.y, 
            player.rotation
        )

        this.enemyMap[player.id] = enemy;  
    }

    showExplosion(x, y) {
        const explosionEmitter = this.explosionParticles.createEmitter({
            frame: ['redBall', 'yellowBall'],
            speed: { min: -800, max: 800 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.6, end: 0 },
            lifespan: 150,
            gravityY: 400,
            x: x,
            y: y,
        });

        for (let i = 0; i < 50; i++) {
            explosionEmitter.explode()
        }
    }

    createAnimations() {
        this.anims.create({
            key: "asteroidFly",
            frameRate: 7,
            frames: this.anims.generateFrameNumbers("asteroid", { start: 1, end: 64 }),
            repeat: -1
        });
    }

    update(time, delta) {
        if (this.gameStarted) {
            this.ship.update(time, delta)
            this.bg.tilePositionX += this.ship.sprite.body.deltaX() * 0.5;
            this.bg.tilePositionY += this.ship.sprite.body.deltaY() * 0.5;

            if (this.qtdAsteroids < this.MAX_ASTEROIDS) {
                this.createAsteroid()
                this.qtdAsteroids ++;
            }

            if(this.lastUpdate == null || (time - this.lastUpdate) > 20)  {
                const playerUpdate = {
                    'id': this.socket.id,
                    'x': this.ship.sprite.x,
                    'y': this.ship.sprite.y,
                    'rotation': this.ship.sprite.rotation
                }
                console.log("ta mandando")
                this.socket.emit("P_UPDATE", playerUpdate)
                this.lastUpdate = time; 
            }
        }
    }

    createAsteroid() {
       this.asteroidsGroup.get() 
    }
}
