class Game {

    private engine: BABYLON.Engine;
    public scene: BABYLON.Scene;
    public player : Player;

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

        // 
        let camera = new BABYLON.FreeCamera('debugCamera', new BABYLON.Vector3(0,5,-10), this.scene);
        camera.setTarget(BABYLON.Vector3.Zero());

        let light = new BABYLON.HemisphericLight('', new BABYLON.Vector3(0, 1, 0), this.scene);
        
        window.addEventListener('keydown', (evt) => {
            if (evt.keyCode == 32) { // space
                this.scene.setActiveCameraByName('debugCamera').attachControl(this.engine.getRenderingCanvas());
            }
        })
    }


    private _initGame () {
        this.scene.debugLayer.show();
        
        let wall = BABYLON.MeshBuilder.CreateBox('origin', {width:20, height:20, depth:1}, this.scene);
        wall.position.z = 10;
        wall.position.y = 8;
        wall.checkCollisions = true;

        this.player = new Player(this);
        
        let e = new Enemy(BABYLON.MeshBuilder.CreateBox('origin', {width:1, height:2, depth:1}, this.scene), this);
        e.position.x = -5;
        let ez = new Enemy(BABYLON.MeshBuilder.CreateBox('origin', {width:1, height:2, depth:1}, this.scene), this);
        ez.position.x = -7;

        // let en = new Enemy(BABYLON.MeshBuilder.CreateBox('origin', {size:1}, this.scene), this)
    }

}
