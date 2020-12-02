class Enemy {

    constructor(scene, id, x, y, rotation) {
        this.sprite = scene.physics.add.image(x, y, 'ship_enemy');
        this.sprite.setDepth(2);
        this.sprite.setScale(1)
        this.sprite.setMaxVelocity(0);
        this.sprite.setBounce(0, 0)
    }
}
