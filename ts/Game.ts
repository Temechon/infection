class Game {

    private engine: BABYLON.Engine;
    public scene: BABYLON.Scene;

    public mybox;
    public direction = [0,0,0,0];

    constructor(canvasId: string) {

        let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById(canvasId);
        this.engine = new BABYLON.Engine(canvas, true);

        this.scene = null;

        window.addEventListener("resize", () => {
            this.engine.resize();
        });

        this._run();

    }

    private _run() {
        
        this._initScene();

        this.scene.executeWhenReady(() => {
            
            // Remove loader
            var loader = <HTMLElement> document.querySelector("#loader");
            loader.style.display = "none";

            this._initGame();

            this.engine.runRenderLoop(() => {
                this.scene.render();
            });
        });
    }

    private _initScene() {

        this.scene = new BABYLON.Scene(this.engine);

        let camera = new BABYLON.ArcRotateCamera('debugCamera', -1.5, 1, 10, new BABYLON.Vector3(0, 0, 0), this.scene);
        camera.attachControl(this.engine.getRenderingCanvas());
        let light = new BABYLON.HemisphericLight('', new BABYLON.Vector3(0, 1, 0), this.scene);
        
    }


/**
 * Draw the local axis of the player
 */
    private  debug (mesh, scene) {

    mesh.computeWorldMatrix();
    var m = mesh.getWorldMatrix();

    var v3 = BABYLON.Vector3;
    var s = 5;

    var x = new v3(s,0,0);
    var y = new v3(0,s,0);
    var z = new v3(0,0,s);

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
    mesh._yAxis = BABYLON.Mesh.CreateLines("lines",
        [startInWorld,
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
}

    private _initGame () {
        this.scene.debugLayer.show();
        
        let box = BABYLON.MeshBuilder.CreateBox('origin', {size:1}, this.scene);
        
        var p = new Player(this);
    }

}
