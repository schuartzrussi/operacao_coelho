class Laser extends Phaser.Physics.Arcade.Image {

    constructor(scene) {
        super(scene);

        Phaser.Physics.Arcade.Image.call(this, scene, 0, 0, "laser");
        this.lifespan = 1000;
        this.speed = 1000;
        this.power = 1000;
        this.setBlendMode(1);
        this.setDepth(1);
        this.setScale(0.6)
        this._temp = new Phaser.Math.Vector2();
    }

    fire(shooterGameObject, speed) {
        this.lifespan = 1000; 
        this.speed = speed;

        this.setActive(true);
        this.setVisible(true);
        this.setAngle(shooterGameObject.body.rotation)
        this.setPosition(shooterGameObject.x, shooterGameObject.y)
        this.body.reset(shooterGameObject.x, shooterGameObject.y)

        var angle = Phaser.Math.DegToRad(shooterGameObject.body.rotation)

        this.scene.physics.velocityFromRotation(angle, this.speed, this.body.velocity)

        this.body.velocity.x *= 2;
        this.body.velocity.y *= 2;
    }

    update(time, delta) {
        this.lifespan -= delta;

        if (this.lifespan <= 0) {
            this.setActive(false);
            this.setVisible(false);
            this.body.stop();
        }
    }
}

