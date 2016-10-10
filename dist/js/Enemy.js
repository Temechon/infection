var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Enemy = (function (_super) {
    __extends(Enemy, _super);
    function Enemy(model, game) {
        _super.call(this, '__enemy__', game);
        this.speed = 1;
        this.hp = 10;
        model.parent = this;
        model.ellipsoid = BABYLON.Vector3.Zero();
        this._updateCall = this._update.bind(this);
        model.checkCollisions = true;
        this.excludedMeshesForCollisions.push(model);
        this.ellipsoid = model.getBoundingInfo().boundingBox.extendSize.clone().multiplyByFloats(1, 0.5, 1);
        // this.debug(2, this);
        this._game.scene.registerBeforeRender(this._updateCall);
    }
    Enemy.prototype._update = function () {
        // get the direction vector
        var colliderPosition = this._game.player.position;
        var dir = colliderPosition.subtract(this.position);
        dir.normalize();
        dir.y = 0;
        var dest = dir.scale(0.015).scale(this.speed * 2);
        this.look(this._game.player.position);
        this.moveWithCollisions(dest);
    };
    /**
     * Damage this enemy. If hp comes to 0, he dies.
     */
    Enemy.prototype.hit = function (damage) {
        this.hp -= damage;
        if (this.hp <= 0) {
            this.dispose();
        }
    };
    Enemy.prototype.look = function (pos) {
        var dv = pos.subtract(this.position);
        var yaw = -Math.atan2(dv.z, dv.x) - Math.PI / 2;
        this.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(yaw, 0, 0);
    };
    return Enemy;
}(GameObject));
//# sourceMappingURL=Enemy.js.map