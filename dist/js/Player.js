var Player = (function () {
    function Player(game) {
        var _this = this;
        this._directions = [0, 0, 0, 0];
        this._game = game;
        var cartesianCoordinates = BABYLON.Vector3.Zero();
        this._game.scene.registerBeforeRender(this._update.bind(this));
        window.addEventListener("keyup", function (evt) {
            _this.handleKeyUp(evt.keyCode);
        });
        window.addEventListener("keydown", function (evt) {
            _this.handleKeyDown(evt.keyCode);
        });
        this._model = BABYLON.MeshBuilder.CreateBox('myfirstbox', { height: 2, width: 1, depth: 1 }, this._game.scene);
    }
    Player.prototype._update = function () {
        this.move();
        // setyup camera
        var cam = this._game.scene.activeCamera;
        var x = cam.radius * Math.cos(cam.alpha) * Math.cos(cam.beta);
        var y = cam.radius * Math.sin(cam.beta);
        var z = cam.radius * Math.sin(cam.alpha) * Math.cos(cam.beta);
        cam.position.copyFromFloats(this._model.position.x + x, this._model.position.y + y, this._model.position.z + z);
        cam.setTarget(this._model.position);
        this._model.rotation.y = -cam.alpha - 1.5;
    };
    Player.prototype.move = function () {
        var localMovement = BABYLON.Vector3.Zero();
        var matrix = this._model.getWorldMatrix();
        if (this._directions[0] != 0) {
            localMovement.z = 1;
        }
        if (this._directions[1] != 0) {
            localMovement.z = -1;
        }
        if (this._directions[2] != 0) {
            localMovement.x = -1;
        }
        if (this._directions[3] != 0) {
            localMovement.x = 1;
        }
        BABYLON.Vector3.TransformCoordinatesToRef(localMovement, matrix, localMovement);
        localMovement.subtractInPlace(this._model.position).scaleInPlace(0.1);
        this._model.position.addInPlace(localMovement);
    };
    Player.prototype._choose_directions = function (nb, value) {
        this._directions[nb] = value;
    };
    Player.prototype.handleKeyDown = function (keycode) {
        switch (keycode) {
            case Player.DIRECTIONS.ZQSD.TOP:
            case Player.DIRECTIONS.QWSD.TOP:
                this._choose_directions(0, 1);
                break;
            case Player.DIRECTIONS.ZQSD.BOT:
            case Player.DIRECTIONS.QWSD.BOT:
                this._choose_directions(1, 1);
                break;
            case Player.DIRECTIONS.ZQSD.LEFT:
            case Player.DIRECTIONS.QWSD.LEFT:
                this._choose_directions(2, 1);
                break;
            case Player.DIRECTIONS.ZQSD.RIGHT:
            case Player.DIRECTIONS.QWSD.RIGHT:
                this._choose_directions(3, 1);
                break;
        }
    };
    Player.prototype.handleKeyUp = function (keycode) {
        switch (keycode) {
            case Player.DIRECTIONS.QWSD.TOP:
            case Player.DIRECTIONS.ZQSD.TOP:
                this._choose_directions(0, 0);
                console.log('reset');
                break;
            case Player.DIRECTIONS.ZQSD.BOT:
            case Player.DIRECTIONS.QWSD.BOT:
                this._choose_directions(1, 0);
                break;
            case Player.DIRECTIONS.ZQSD.LEFT:
            case Player.DIRECTIONS.QWSD.LEFT:
                this._choose_directions(2, 0);
                break;
            case Player.DIRECTIONS.ZQSD.RIGHT:
            case Player.DIRECTIONS.QWSD.RIGHT:
                this._choose_directions(3, 0);
                break;
        }
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
    return Player;
}());
//# sourceMappingURL=Player.js.map