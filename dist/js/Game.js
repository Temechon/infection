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
        this.scene = new BABYLON.Scene(this.engine);
        var camera = new BABYLON.ArcRotateCamera('debugCamera', -1.5, 1, 10, new BABYLON.Vector3(0, 0, 0), this.scene);
        camera.attachControl(this.engine.getRenderingCanvas());
        var light = new BABYLON.HemisphericLight('', new BABYLON.Vector3(0, 1, 0), this.scene);
    };
    /**
     * Draw the local axis of the player
     */
    Game.prototype.debug = function (mesh, scene) {
        mesh.computeWorldMatrix();
        var m = mesh.getWorldMatrix();
        var v3 = BABYLON.Vector3;
        var s = 5;
        var x = new v3(s, 0, 0);
        var y = new v3(0, s, 0);
        var z = new v3(0, 0, s);
        var startInWorld = mesh.getAbsolutePosition();
        var endInWorld = BABYLON.Vector3.TransformCoordinates(x, m);
        if (mesh._xAxis) {
            mesh._xAxis.dispose();
        }
        mesh._xAxis = BABYLON.Mesh.CreateLines("lines", [
            startInWorld,
            endInWorld
        ], scene);
        mesh._xAxis.color = BABYLON.Color3.Red();
        var endInWorld = BABYLON.Vector3.TransformCoordinates(y, m);
        if (mesh._yAxis) {
            mesh._yAxis.dispose();
        }
        mesh._yAxis = BABYLON.Mesh.CreateLines("lines", [startInWorld,
            endInWorld
        ], scene);
        mesh._yAxis.color = BABYLON.Color3.Green();
        var endInWorld = BABYLON.Vector3.TransformCoordinates(z, m);
        if (mesh._zAxis) {
            mesh._zAxis.dispose();
        }
        mesh._zAxis = BABYLON.Mesh.CreateLines("lines", [
            startInWorld,
            endInWorld
        ], scene);
        mesh._zAxis.color = BABYLON.Color3.Blue();
    };
    Game.prototype._initGame = function () {
        this.scene.debugLayer.show();
        var box = BABYLON.MeshBuilder.CreateBox('origin', { size: 1 }, this.scene);
        var p = new Player(this);
    };
    return Game;
}());
//# sourceMappingURL=Game.js.map