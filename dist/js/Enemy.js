var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Enemy = (function (_super) {
    __extends(Enemy, _super);
    function Enemy(model, game) {
        var _this = this;
        _super.call(this, '__enemy__', game.scene);
        this.speed = 1;
        this.look = function (pos) {
            var dv = pos.subtract(this.position);
            var yaw = -Math.atan2(dv.z, dv.x) - Math.PI / 2;
            this.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(yaw, 0, 0);
        };
        this._game = game;
        model.parent = this;
        this._updateCall = this._update.bind(this);
        this.ellipsoid = new BABYLON.Vector3(0.5, 0.25, 0.5).scaleInPlace(2);
        var displayEllipsoid = function (elem) {
            var material = _this._game.scene.getMaterialByName("__ellipsoidMat__");
            if (!material) {
                material = new BABYLON.StandardMaterial("__ellipsoidMat__", _this._game.scene);
                material.wireframe = true;
                material.emissiveColor = BABYLON.Color3.Green();
                material.specularColor = BABYLON.Color3.Black();
            }
            var s = BABYLON.Mesh.CreateSphere("__ellipsoid__", 8, 1, _this._game.scene);
            s.scaling = elem.ellipsoid.clone();
            s.scaling.y *= 4;
            s.scaling.x *= 2;
            s.scaling.z *= 2;
            s.material = material;
            s.parent = elem;
            s.computeWorldMatrix(true);
        };
        displayEllipsoid(this);
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
    return Enemy;
}(BABYLON.Mesh));
//# sourceMappingURL=Enemy.js.map