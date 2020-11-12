const ItemTypes = (
    ITEM_AMMO = "item_ammo"
)


class Item extends Phaser.Physics.Arcade.Sprite {
 
    constructor(scene, type, x, y) {
        super(scene);

        Phaser.Physics.Arcade.Sprite.call(this, scene, x, y, type);
        this.setBlendMode(0);
        this.setDepth(2);

        this.type = type;
    }

} 
