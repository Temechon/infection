var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(game) {
        _super.call(this, '__player__', game.scene);
        this._lookRotation = 0;
        this._localMovement = BABYLON.Vector3.Zero();
        this.speed = 2;
        this._directions = [0, 0, 0, 0];
        this._shootingDirections = BABYLON.Vector3.Zero();
        this._game = game;
        // Player game loop
        this._updateCall = this._update.bind(this);
        this._game.scene.registerBeforeRender(this._updateCall);
        // Keyboard events
        this._handleKeyDownCall = this._handleKey.bind(this, 1);
        this._handleKeyUpCall = this._handleKey.bind(this, 0);
        window.addEventListener("keyup", this._handleKeyUpCall);
        window.addEventListener("keydown", this._handleKeyDownCall);
        // Model
        this._model = BABYLON.MeshBuilder.CreateBox('myfirstbox', { height: 2, width: 1, depth: 1 }, this._game.scene);
        this._model.parent = this;
        this._model.ellipsoid = BABYLON.Vector3.Zero();
        this.ellipsoid = this._model.getBoundingInfo().boundingBox.extendSize.clone().multiplyByFloats(1, 0.5, 1);
        // Create default weapon
        this.weapon = new Weapon(this._game);
        this.debug(2, this);
        this.debug(4, this._model);
    }
    Player.prototype.dispose = function () {
        window.removeEventListener("keyup", this._handleKeyUpCall);
        window.removeEventListener("keydown", this._handleKeyDownCall);
        this._game.scene.unregisterBeforeRender(this._updateCall);
        _super.prototype.dispose.call(this);
    };
    Player.prototype._update = function () {
        this._move();
        this._shoot();
    };
    /**
     * Move the player (parent mesh), and adapt the child orientation
     */
    Player.prototype._move = function () {
        this._localMovement.copyFromFloats(0, 0, 0);
        var matrix = this.getWorldMatrix();
        if (this._directions[0] != 0) {
            this._localMovement.z = 1;
            this._lookRotation = 0;
        }
        if (this._directions[1] != 0) {
            this._localMovement.z = -1;
            this._lookRotation = Math.PI;
        }
        if (this._directions[2] != 0) {
            this._localMovement.x = -1;
            this._lookRotation = -Math.PI / 2;
            if (this._directions[0] != 0) {
                this._lookRotation = -Math.PI / 4;
            }
            if (this._directions[1] != 0) {
                this._lookRotation = -3 * Math.PI / 4;
            }
        }
        if (this._directions[3] != 0) {
            this._localMovement.x = 1;
            this._lookRotation = Math.PI / 2;
            if (this._directions[0] != 0) {
                this._lookRotation = Math.PI / 4;
            }
            if (this._directions[1] != 0) {
                this._lookRotation = 3 * Math.PI / 4;
            }
        }
        BABYLON.Vector3.TransformCoordinatesToRef(this._localMovement, matrix, this._localMovement);
        this._localMovement.subtractInPlace(this.position).scaleInPlace(0.1 * this.speed);
        this.moveWithCollisions(this._localMovement);
        this._model.rotation.y = this._lookRotation;
    };
    Player.prototype._shoot = function () {
        if (this._shootingDirections.lengthSquared() > 0) {
            this.weapon.shoot(this.position, this._shootingDirections);
        }
    };
    Player.prototype._choose = function (array, nb, value) {
        array[nb] = value;
    };
    Player.prototype._handleKey = function (value, evt) {
        switch (evt.keyCode) {
            case Player.DIRECTIONS.ZQSD.TOP:
            case Player.DIRECTIONS.QWSD.TOP:
                this._choose(this._directions, 0, value);
                break;
            case Player.DIRECTIONS.ZQSD.BOT:
            case Player.DIRECTIONS.QWSD.BOT:
                this._choose(this._directions, 1, value);
                break;
            case Player.DIRECTIONS.ZQSD.LEFT:
            case Player.DIRECTIONS.QWSD.LEFT:
                this._choose(this._directions, 2, value);
                break;
            case Player.DIRECTIONS.ZQSD.RIGHT:
            case Player.DIRECTIONS.QWSD.RIGHT:
                this._choose(this._directions, 3, value);
                break;
            case Player.ACTIONS.SHOOT.TOP:
                this._shootingDirections.z = value;
                break;
            case Player.ACTIONS.SHOOT.BOT:
                this._shootingDirections.z = -value;
                break;
            case Player.ACTIONS.SHOOT.LEFT:
                this._shootingDirections.x = -value;
                break;
            case Player.ACTIONS.SHOOT.RIGHT:
                this._shootingDirections.x = value;
                break;
        }
    };
    Player.prototype.displayEllipsoid = function (elem) {
        var material = this._game.scene.getMaterialByName("__ellipsoidMat__");
        if (!material) {
            material = new BABYLON.StandardMaterial("__ellipsoidMat__", this._game.scene);
            material.wireframe = true;
            material.emissiveColor = BABYLON.Color3.Green();
            material.specularColor = BABYLON.Color3.Black();
        }
        var s = BABYLON.Mesh.CreateSphere("__ellipsoid__", 8, 1, this._game.scene);
        s.scaling = elem.ellipsoid.clone();
        s.scaling.y *= 4;
        s.scaling.x *= 2;
        s.scaling.z *= 2;
        s.material = material;
        s.parent = elem;
        s.computeWorldMatrix(true);
    };
    ;
    /**
     * Draw the local axis of the player
     */
    Player.prototype.debug = function (size, mesh) {
        mesh.computeWorldMatrix();
        var m = mesh.getWorldMatrix();
        // Axis
        var x = new BABYLON.Vector3(size, 0, 0);
        var y = new BABYLON.Vector3(0, size, 0);
        var z = new BABYLON.Vector3(0, 0, size);
        // Draw an axis of the given color
        var _drawAxis = function (color, start, end) {
            var axis = BABYLON.Mesh.CreateLines("lines", [
                start,
                end
            ], mesh.getScene());
            axis.color = color;
            return axis;
        };
        var xAxis = _drawAxis(BABYLON.Color3.Red(), mesh.getAbsolutePosition(), BABYLON.Vector3.TransformCoordinates(x, m));
        xAxis.parent = mesh;
        var yAxis = _drawAxis(BABYLON.Color3.Green(), mesh.getAbsolutePosition(), BABYLON.Vector3.TransformCoordinates(x, m));
        yAxis.parent = mesh;
        var zAxis = _drawAxis(BABYLON.Color3.Blue(), mesh.getAbsolutePosition(), BABYLON.Vector3.TransformCoordinates(x, m));
        zAxis.parent = mesh;
        // Ellipsoid 
        var ellipsoidMat = mesh.getScene().getMaterialByName("__ellipsoidMat__");
        if (!ellipsoidMat) {
            ellipsoidMat = new BABYLON.StandardMaterial("__ellipsoidMat__", mesh.getScene());
            ellipsoidMat.wireframe = true;
            ellipsoidMat.emissiveColor = BABYLON.Color3.Green();
            ellipsoidMat.specularColor = BABYLON.Color3.Black();
        }
        var ellipsoid = BABYLON.Mesh.CreateSphere("__ellipsoid__", 9, 1, mesh.getScene());
        ellipsoid.scaling = mesh.ellipsoid.clone();
        ellipsoid.scaling.y *= 4;
        ellipsoid.scaling.x *= 2;
        ellipsoid.scaling.z *= 2;
        ellipsoid.material = ellipsoidMat;
        ellipsoid.parent = mesh;
        ellipsoid.computeWorldMatrix(true);
    };
    Player.DIRECTIONS = {
        ZQSD: {
            TOP: 90,
            BOT: 83,
            LEFT: 81,
            RIGHT: 68
        },
        QWSD: {
            TOP: 87,
            BOT: 83,
            LEFT: 65,
            RIGHT: 68
        }
    };
    Player.ACTIONS = {
        SHOOT: {
            TOP: 38,
            BOT: 40,
            LEFT: 37,
            RIGHT: 39
        }
    };
    return Player;
}(BABYLON.Mesh));
//# sourceMappingURL=Player.js.map