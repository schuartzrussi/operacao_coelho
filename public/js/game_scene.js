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
        this.windowWidth = window.innerWidth * window.devicePixelRatio
        this.windowHeight = window.innerHeight * window.devicePixelRatio
        this.bg = this.add.tileSprite(this.windowWidth / 2, this.windowHeight / 2, this.windowWidth, this.windowHeight, 'background').setScrollFactor(0);
        
        this.createAnimations();

        const self = this;

        this.ship = new Ship(this, function () {
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
        this.ship.update(time, delta)
        this.bg.tilePositionX += this.ship.sprite.body.deltaX() * 0.5;
        this.bg.tilePositionY += this.ship.sprite.body.deltaY() * 0.5;

        if (this.qtdAsteroids < this.MAX_ASTEROIDS) {
            this.createAsteroid()
            this.qtdAsteroids ++;
        }
    }

    createAsteroid() {
       this.asteroidsGroup.get() 
    }
}
