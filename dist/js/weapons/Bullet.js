var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Bullet = (function (_super) {
    __extends(Bullet, _super);
    function Bullet(game, pos, dir) {
        _super.call(this, '__bullet__', game);
        this._initialPosition = BABYLON.Vector3.Zero();
        this._direction = BABYLON.Vector3.Zero();
        this.speed = 0.5;
        this.maxRange = 40;
        this.strength = 1;
        this._model = BABYLON.MeshBuilder.CreateSphere('__bullet__', { diameter: 1 }, this.getScene());
        this._model.parent = this;
        this._model.ellipsoid = BABYLON.Vector3.Zero();
        this.position.copyFrom(pos);
        this._initialPosition.copyFrom(pos);
        this._direction.copyFrom(dir);
        this.ellipsoid = this._model.getBoundingInfo().boundingBox.extendSize.clone().multiplyByFloats(1, 0.5, 1);
        this.debug(2, this);
        this._updateCall = this._update.bind(this);
        this._game.scene.registerBeforeRender(this._updateCall);
        this.onCollideObservable.add(this._onCollision.bind(this));
    }
    Bullet.prototype._update = function () {
        this.moveWithCollisions(this._direction.scale(this.speed));
        // Compute distance travelled
        var dist = BABYLON.Vector3.DistanceSquared(this._initialPosition, this.position);
        if (dist > this.maxRange) {
            // Destroy it
            this.dispose();
        }
    };
    Bullet.prototype.dispose = function () {
        // unregister move
        this._game.scene.unregisterBeforeRender(this._updateCall);
        _super.prototype.dispose.call(this);
    };
    /**
     * On collision, do something if it's an enemy. Otherwise, destroy it
     */
    Bullet.prototype._onCollision = function (mesh) {
        console.log(mesh.name);
        if (mesh instanceof Enemy) {
            var enemy = mesh;
            enemy.hit(this.strength);
        }
        this.dispose();
    };
    return Bullet;
}(GameObject));
//# sourceMappingURL=Bullet.js.map