var config = {
    type: Phaser.CANVAS,
    width: window.innerWidth * window.devicePixelRatio,
    height: window.innerHeight * window.devicePixelRatio,
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    scene: [GameScene]
}


const game = new Phaser.Game(config)
