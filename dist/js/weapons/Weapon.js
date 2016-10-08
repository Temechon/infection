var Weapon = (function () {
    function Weapon(game) {
        var _this = this;
        // This weapon can shoot each XX ms
        this.cadency = 10;
        this._canShoot = true;
        this._game = game;
        this._cadencyTimer = new Timer(this.cadency, game.scene, { repeat: -1, autostart: true });
        this._cadencyTimer.callback = function () {
            _this._canShoot = true;
        };
    }
    Weapon.prototype.shoot = function (pos, dir) {
        if (this._canShoot) {
            this._canShoot = false;
            new Bullet(this._game, pos, dir);
        }
    };
    return Weapon;
}());
//# sourceMappingURL=Weapon.js.map