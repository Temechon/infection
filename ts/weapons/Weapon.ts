class Weapon {
    
    private _game : Game;
    
    // The cadency timer reset the boolean 'canShoot'.
    private _cadencyTimer : Timer;
    
    // This weapon can shoot each XX ms
    public cadency : number = 200;
    
    private _canShoot : boolean = true;
    
    constructor(game:Game) {
        this._game = game;
        
        this._cadencyTimer = new Timer(this.cadency, game.scene, {repeat:-1, autostart:true});
        this._cadencyTimer.callback = () => {
            this._canShoot = true;
        };
    }
        
    public shoot(pos : BABYLON.Vector3, dir:BABYLON.Vector3) {
        if (this._canShoot) {
            this._canShoot = false;
            new Bullet(this._game, pos, dir);
        }
    }
    
}