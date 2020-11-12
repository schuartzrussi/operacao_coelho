class Info {

    constructor(scene, bullets, windowWidth, windowHeight) {
        this.scene = scene;
        this.windowWidth = windowWidth;
        this.windowHeight = windowHeight;

        this.kills = 0;
        this.deaths = 0;
        this.bullets = bullets;

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
        return `Kills:${this.kills}  Deaths:${this.deaths}  Bullets:${this.bullets}`
    }

    updatePlayerInfoText() {
        this.playerInfoText.setText(this.getPlayerInfoText())
    }

    onUpdateKills(k) {
        this.kills = k;
        this.updatePlayerInfoText();
    }

    onUpdateDeaths(d) {
        this.deaths = d;
        this.updatePlayerInfoText();
    }

    onUpdateBullets(b) {
        this.bullets = b;
        this.updatePlayerInfoText();
    }

    onRankUpdated(players) {
        //
    }
}
