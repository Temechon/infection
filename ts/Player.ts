class Player {

    private _model : BABYLON.Mesh;
    private _cameraPosition : BABYLON.Mesh;
    private _game : Game;
    private _camera : BABYLON.ArcRotateCamera;

    private _directions : Array<number> = [0,0,0,0];

    constructor(game:Game) {
        this._game = game;

        this._camera = new BABYLON.ArcRotateCamera('playerCamera', -1.5, Math.PI/2, 0, new BABYLON.Vector3(0, 0, 0), this._game.scene);
        this._camera.lowerRadiusLimit = 0;
        this._camera.upperRadiusLimit = 0;
        // this._camera.lowerBetaLimit = Math.PI/2-0.3;
        // this._camera.upperBetaLimit = Math.PI/2+0.3;
        
        this._camera.checkCollisions = true;
        this._game.scene.setActiveCameraByName('playerCamera').attachControl(this._game.scene.getEngine().getRenderingCanvas());

        let cartesianCoordinates = BABYLON.Vector3.Zero(); 
        this._game.scene.registerBeforeRender(this._update.bind(this));

         window.addEventListener("keyup", (evt)=> {
            this.handleKeyUp(evt.keyCode);
        });

        window.addEventListener("keydown", (evt)=> {
            this.handleKeyDown(evt.keyCode);
        });
        
        this._model = BABYLON.MeshBuilder.CreateBox('myfirstbox', {height:2, width:1, depth:1}, this._game.scene);

        this._cameraPosition = BABYLON.MeshBuilder.CreateBox('viseur', {height:0.5, width:0.5, depth:0.5}, this._game.scene);
        this._cameraPosition.position.copyFromFloats(2,2,-4);
        this._cameraPosition.parent = this._model;
        // this._cameraPosition.isVisible = false;
    }

    get position() : BABYLON.Vector3 {
        return this._model.position;
    }

    private _update() {
        this.move();

        this.debug(this._model, this._game.scene);

        // setyup camera
        let cam = (<BABYLON.ArcRotateCamera>this._camera);
        let x = cam.radius * Math.cos(cam.alpha) * Math.cos(cam.beta);
        let y = cam.radius * Math.sin(cam.beta);
        let z = cam.radius * Math.sin(cam.alpha) * Math.cos(cam.beta);
        let pos = this._cameraPosition.getAbsolutePosition();
        cam.position.copyFromFloats(
            pos.x + x,
            pos.y + y,
            pos.z + z);
            
        cam.setTarget(pos);

        this._model.rotation.y = -cam.alpha -1.5;
    }

    public static DIRECTIONS = {
            ZQSD : {
                TOP     : 90,
                BOT     : 83,
                LEFT    : 81,
                RIGHT   : 68
            },
            QWSD : {
                TOP     : 87,
                BOT     : 83,
                LEFT    : 65,
                RIGHT   : 68
            }
        };

    private move() {
        
        let localMovement = BABYLON.Vector3.Zero();
        let matrix = this._model.getWorldMatrix();

        if (this._directions[0] != 0) { // top
            localMovement.z = 1;
        }
        if (this._directions[1] != 0) { // bot
            localMovement.z = -1;
        }
        if (this._directions[2] != 0) { // left
            localMovement.x = -1;
        }
        if (this._directions[3] != 0) { // right
            localMovement.x = 1;
        }

        BABYLON.Vector3.TransformCoordinatesToRef(localMovement, matrix, localMovement);
        localMovement.subtractInPlace(this._model.position).scaleInPlace(0.1);
        this._model.position.addInPlace(localMovement);
    }

    private _choose_directions (nb, value) {
        this._directions[nb] = value;
    }

     public handleKeyDown(keycode) {
        switch (keycode) {
            case Player.DIRECTIONS.ZQSD.TOP :
            case Player.DIRECTIONS.QWSD.TOP :
                this._choose_directions(0, 1);
                break;
            case Player.DIRECTIONS.ZQSD.BOT :
            case Player.DIRECTIONS.QWSD.BOT :
                this._choose_directions(1, 1);
                break;
            case Player.DIRECTIONS.ZQSD.LEFT:
            case Player.DIRECTIONS.QWSD.LEFT :
                this._choose_directions(2, 1);
                break;
            case Player.DIRECTIONS.ZQSD.RIGHT:
            case Player.DIRECTIONS.QWSD.RIGHT :
                this._choose_directions(3, 1);
                break;
        }
    }

    public handleKeyUp(keycode) {

        switch (keycode) {
            case Player.DIRECTIONS.QWSD.TOP :
            case Player.DIRECTIONS.ZQSD.TOP :
                this._choose_directions(0,0);
                break;
            case Player.DIRECTIONS.ZQSD.BOT :
            case Player.DIRECTIONS.QWSD.BOT :
                this._choose_directions(1, 0);
                break;
            case Player.DIRECTIONS.ZQSD.LEFT:
            case Player.DIRECTIONS.QWSD.LEFT :
                this._choose_directions(2, 0);
                break;
            case Player.DIRECTIONS.ZQSD.RIGHT:
            case Player.DIRECTIONS.QWSD.RIGHT :
                this._choose_directions(3, 0);
                break;
        }
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




}