var Game = (function () {
    function Game(canvasId) {
        var _this = this;
        this.direction = [0, 0, 0, 0];
        var canvas = document.getElementById(canvasId);
        this.engine = new BABYLON.Engine(canvas, true);
        this.scene = null;
        window.addEventListener("resize", function () {
            _this.engine.resize();
        });
        this._run();
    }
    Game.prototype._run = function () {
        var _this = this;
        this._initScene();
        this.scene.executeWhenReady(function () {
            // Remove loader
            var loader = document.querySelector("#loader");
            loader.style.display = "none";
            _this._initGame();
            _this.engine.runRenderLoop(function () {
                _this.scene.render();
            });
        });
    };
    Game.prototype._initScene = function () {
        var _this = this;
        this.scene = new BABYLON.Scene(this.engine);
        // 
        var camera = new BABYLON.FreeCamera('debugCamera', new BABYLON.Vector3(0, 5, -10), this.scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        var light = new BABYLON.HemisphericLight('', new BABYLON.Vector3(0, 1, 0), this.scene);
        window.addEventListener('keydown', function (evt) {
            if (evt.keyCode == 32) {
                _this.scene.setActiveCameraByName('debugCamera').attachControl(_this.engine.getRenderingCanvas());
            }
        });
    };
    Game.prototype._initGame = function () {
        this.scene.debugLayer.show();
        var wall = BABYLON.MeshBuilder.CreateBox('origin', { width: 20, height: 20, depth: 1 }, this.scene);
        wall.position.z = 10;
        wall.position.y = 8;
        wall.checkCollisions = true;
        this.player = new Player(this);
        var e = new Enemy(BABYLON.MeshBuilder.CreateBox('origin', { width: 1, height: 2, depth: 1 }, this.scene), this);
        e.position.x = -5;
        var ez = new Enemy(BABYLON.MeshBuilder.CreateBox('origin', { width: 1, height: 2, depth: 1 }, this.scene), this);
        ez.position.x = -7;
        // let en = new Enemy(BABYLON.MeshBuilder.CreateBox('origin', {size:1}, this.scene), this)
    };
    return Game;
}());
//# sourceMappingURL=Game.js.map