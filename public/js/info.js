class Info {

    constructor(scene, bullets, windowWidth, windowHeight) {
        this.scene = scene;
        this.windowWidth = windowWidth;
        this.windowHeight = windowHeight;

        this.kills = 0;
        this.bullets = bullets;
        this.players = 0

        const [playerInfoX, playerInfoY] = this.calcPlayerInfoPosition()
        this.playerInfoText = scene.add.text(playerInfoX, playerInfoY, this.getPlayerInfoText(), { fontSize: '28px', fill: '#fff' });
        this.playerInfoText.setScrollFactor(0)
    }

    calcPlayerInfoPosition() {
        const x = 10; 
        const y = 10; 

        return [x, y];
    }

    getPlayerInfoText() {
        return `Kills:${this.kills}  Bullets:${this.bullets}  Players:${this.players}`
    }

    updatePlayerInfoText() {
        this.playerInfoText.setText(this.getPlayerInfoText())
    }

    addKill() {
        this.kills = this.kills + 1;
        this.updatePlayerInfoText();
    }

    onUpdateBullets(b) {
        this.bullets = b;
        this.updatePlayerInfoText();
    }

    onUpdatePlayersQuantity(p) {
        this.players = p
        this.updatePlayerInfoText()
    }
}
