class Enemy {

    constructor(scene, id, x, y, rotation) {
        this.sprite = scene.physics.add.image(x, y, 'ship');
        this.sprite.setDepth(2);
        this.sprite.setDrag(300);
        this.sprite.setScale(1)
        this.sprite.setAngularDrag(400);
        this.sprite.setMaxVelocity(600);
    }
}
