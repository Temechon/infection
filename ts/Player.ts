class Player extends BABYLON.Mesh{

    private _model : BABYLON.Mesh;
    private _lookRotation : number = 0;
    private _localMovement : BABYLON.Vector3 = BABYLON.Vector3.Zero();
    
    private _handleKeyUpCall : EventListener;
    private _handleKeyDownCall : EventListener;
    private _updateCall : () => void;
    
    private _game : Game;
    public speed : number = 2;

    // The player weapon    
    public weapon : Weapon;

    private _directions : Array<number> = [0,0,0,0];
    private _shootingDirections : BABYLON.Vector3 = BABYLON.Vector3.Zero();

    constructor(game:Game) {
        super('__player__', game.scene);
        
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
        this._model = BABYLON.MeshBuilder.CreateBox('myfirstbox', {height:2, width:1, depth:1}, this._game.scene);
        this._model.parent = this;
        this._model.ellipsoid = BABYLON.Vector3.Zero();
        
        this.ellipsoid = this._model.getBoundingInfo().boundingBox.extendSize.clone().multiplyByFloats(1,0.5,1);
        
        // Create default weapon
        this.weapon = new Weapon(this._game);
        
        this.debug(2,this);
        this.debug(4,this._model);        
    }
    
    public dispose() {
        window.removeEventListener("keyup", this._handleKeyUpCall);
        window.removeEventListener("keydown", this._handleKeyDownCall);
        this._game.scene.unregisterBeforeRender(this._updateCall);
        
        super.dispose();
    }

    private _update() {
        this._move();
        this._shoot();
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
    
    public static ACTIONS = {
        SHOOT : {
            TOP     : 38,
            BOT     : 40,
            LEFT    : 37,
            RIGHT   : 39            
        } 
    };

    /**
     * Move the player (parent mesh), and adapt the child orientation
     */
    private _move() {
        
        this._localMovement.copyFromFloats(0,0,0);
        let matrix = this.getWorldMatrix();

        if (this._directions[0] != 0) { // top
            this._localMovement.z = 1;   
            this._lookRotation = 0;
        }
        if (this._directions[1] != 0) { // bot
            this._localMovement.z = -1;
            this._lookRotation = Math.PI;
        }
        if (this._directions[2] != 0) { // left
            this._localMovement.x = -1;
            this._lookRotation = -Math.PI/2;
            if (this._directions[0] != 0) { // top and left
                this._lookRotation = -Math.PI/4;
            }
            if (this._directions[1] != 0) { // bot and left
                this._lookRotation = -3*Math.PI/4;
            }
        }
        if (this._directions[3] != 0) { // right
            this._localMovement.x = 1;
            this._lookRotation = Math.PI/2;
            if (this._directions[0] != 0) { // top and left
                this._lookRotation = Math.PI/4;
            }
            if (this._directions[1] != 0) { // bot and left
                this._lookRotation = 3*Math.PI/4;
            }
        }

        BABYLON.Vector3.TransformCoordinatesToRef(this._localMovement, matrix, this._localMovement);
        this._localMovement.subtractInPlace(this.position).scaleInPlace(0.1*this.speed);
        this.moveWithCollisions(this._localMovement);
        this._model.rotation.y = this._lookRotation;
    }
    
    private _shoot() {
        if (this._shootingDirections.lengthSquared() > 0){
            this.weapon.shoot(this.position, this._shootingDirections);
        } 
    }

    private _choose (array, nb, value) {
        array[nb] = value;
    }

    private _handleKey(value, evt : KeyboardEvent) {
        switch (evt.keyCode) {
            case Player.DIRECTIONS.ZQSD.TOP :
            case Player.DIRECTIONS.QWSD.TOP :
                this._choose(this._directions, 0, value);
                break;
            case Player.DIRECTIONS.ZQSD.BOT :
            case Player.DIRECTIONS.QWSD.BOT :
                this._choose(this._directions, 1, value);
                break;
            case Player.DIRECTIONS.ZQSD.LEFT:
            case Player.DIRECTIONS.QWSD.LEFT :
                this._choose(this._directions, 2, value);
                break;
            case Player.DIRECTIONS.ZQSD.RIGHT:
            case Player.DIRECTIONS.QWSD.RIGHT :
                this._choose(this._directions, 3, value);
                break;
            case Player.ACTIONS.SHOOT.TOP : 
                this._shootingDirections.z = value;
                break;
            case Player.ACTIONS.SHOOT.BOT : 
                this._shootingDirections.z = -value;
                break;
            case Player.ACTIONS.SHOOT.LEFT : 
                this._shootingDirections.x = -value;
                break;
            case Player.ACTIONS.SHOOT.RIGHT : 
                this._shootingDirections.x = value;
                break;
        }
    }
    
    private displayEllipsoid (elem) {
            var material = this._game.scene.getMaterialByName("__ellipsoidMat__") as BABYLON.StandardMaterial;
            if (! material) {
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
    
    /**
     * Draw the local axis of the player
     */
    private  debug (size : number, mesh : BABYLON.AbstractMesh) {

        mesh.computeWorldMatrix();
        var m = mesh.getWorldMatrix();
        
        // Axis
        var x = new BABYLON.Vector3(size,0,0);
        var y = new BABYLON.Vector3(0,size,0);
        var z = new BABYLON.Vector3(0,0,size);
        
        // Draw an axis of the given color
        let _drawAxis = (color, start, end) : BABYLON.LinesMesh => {
            let axis = BABYLON.Mesh.CreateLines("lines", [
                start,
                end
            ], mesh.getScene());
            axis.color = color;
            return axis;
        };
        
        let xAxis = _drawAxis(
                BABYLON.Color3.Red(), 
                mesh.getAbsolutePosition(),
                BABYLON.Vector3.TransformCoordinates(x, m));
        xAxis.parent = mesh;        
        let yAxis = _drawAxis(
                BABYLON.Color3.Green(), 
                mesh.getAbsolutePosition(),
                BABYLON.Vector3.TransformCoordinates(x, m));
        yAxis.parent = mesh;
        let zAxis = _drawAxis(
                BABYLON.Color3.Blue(), 
                mesh.getAbsolutePosition(),
                BABYLON.Vector3.TransformCoordinates(x, m));
        zAxis.parent = mesh;
        
        // Ellipsoid 
        let ellipsoidMat = mesh.getScene().getMaterialByName("__ellipsoidMat__") as BABYLON.StandardMaterial;
        if (! ellipsoidMat) { 
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
    }
    
}