class Asteroid extends Phaser.Physics.Arcade.Sprite {

    constructor(scene) {
        super(scene);

        Phaser.Physics.Arcade.Sprite.call(this, scene, 0, 0, "asteroid");
        this.setBlendMode(0);
        this.setDepth(2);
        const randomValue = getRandomInt(1, 10)
        this.setScale(randomValue/10);

        const positionX = getRandomInt(-5000, 5000)
        const positionY = getRandomInt(-5000, 5000)

        this.setPosition(positionX, positionY)
        this.setVisible(true);
        this.play("asteroidFly");

        let maxVelocity = 4;
        if (randomValue > 5) {
            this.life = 3000;
            maxVelocity = 1;
        } else if (randomValue > 3) {
            this.life = 2000;
            maxVelocity = 3;
        } else {
            this.life = 1000;
        }

       
        this.updateRate = getRandomInt(1, maxVelocity)
        this.xUpdateRate = 0
        this.yUpdateRate = 0

        if (Math.random() > 0.5) {
            if (Math.random() > 0.5) {
                this.xUpdateRate = this.updateRate
            } else {
                this.xUpdateRate = -this.updateRate
            }
        }

        if (this.xUpdateRate == 0 || Math.random() > 0.5) {
            if (Math.random() > 0.5) {
                this.yUpdateRate = this.updateRate
            } else {
                this.yUpdateRate = -this.updateRate
            }
        }

    }

    update(time, delta) {
        this.setImmovable()
        this.setImmovable()
        this.setPosition(this.x + this.xUpdateRate, this.y + this.yUpdateRate)

        if (this.x > 5000 || this.x < -5000) {
            this.destroy()
        } else if (this.y > 5000 || this.y < -5000) {
            this.destroy()
        }
    }

    addDamage(damage) {
        this.life -= damage;
    }
}
