class MenuScene extends Phaser.Scene {

    MAX_ASTEROIDS = 300; 

    constructor() {
        super({
            key: 'menuScene'
        });
    }

    preload() {
        this.load.image('menu_background', 'images/menu_background.jpg')
    }  


    create() {
        this.add.image(0, 0, 'menu_background').setOrigin(0, 0).setScale(0.6);

        this.add.text(225, 400, `Click Here To Play!`, {
          fontSize: '32px',
          fill: '#FF0000',
          fontStyle: 'bold',
        }).setInteractive( {useHandCursor: true}).on('pointerdown', () => this.scene.start('gameScene'));
    }
}
