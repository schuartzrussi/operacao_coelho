class Ship {

    constructor(scene, positionX, positionY, fireCallback, socket) {
        this.scene = scene
        this.socket = socket
        
        this.fireCallback = fireCallback

        // const positionX = getRandomInt(-5000, 5000)
        // const positionY = getRandomInt(-5000, 5000)

        this.sprite = scene.physics.add.image(positionX, positionY, 'ship');
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setDepth(2);
        this.sprite.setDrag(300);
        this.sprite.setScale(1)
        this.sprite.setAngularDrag(400);
        this.sprite.setMaxVelocity(600);
        this.sprite.setBounce(0, 0)

        this.life = 1000;
        this.bullets = 20;
        this.fire = false;
        this.lastFired = 0;

        this.cursors = scene.input.keyboard.createCursorKeys();
        this.fire = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.particles = scene.add.particles('particles');
        this.sprite.emitter = this.particles.createEmitter({
            frame: ['redBall', 'yellowBall'],
            speed: 50,
            scale: {
                start: 0.2,
                end: 0
            },
            lifespan: 350,
            on: false
        });

        this.sprite.emitter.startFollow(this.sprite);

        this.lasers = scene.physics.add.group({
            classType: Laser,
            maxSize: 30,
            runChildUpdate: true
        });
    }

    update(time, delta) {
        if (this.cursors.left.isDown) {
            this.sprite.setAngularVelocity(-150);
        } else if (this.cursors.right.isDown) {
            this.sprite.setAngularVelocity(150);
        } else {
            this.sprite.setAngularVelocity(0);
        }

        if (this.cursors.up.isDown) {
            this.sprite.emitter.on = true;
            this.scene.physics.velocityFromRotation(this.sprite.rotation, 600, this.sprite.body.acceleration);
        } else {
            this.sprite.emitter.on = false;
            this.sprite.setAcceleration(0);
        }

        if (this.fire.isDown && time > this.lastFired) {
            if (this.bullets > 0) {
                var laser = this.lasers.get();

                if (laser) {
                    this.socket.emit("FIRE")
                    laser.fire(this.sprite, 1500);
                    this.lastFired = time + 350;
                    this.bullets --;
                    this.fireCallback()
                }
            }
        }

        const updateEvent = {
            "id": this.socket.id,
            "x": this.sprite.x,
            "y": this.sprite.y,
            "rotation": this.sprite.rotation,
            "angle": this.sprite.angle,
        }

        this.socket.emit("P_UPDATE", updateEvent)
    }
}
