class Bullet extends BABYLON.Mesh {
    
    private _game : Game;
    
    private _model : BABYLON.Mesh;
    private _initialPosition : BABYLON.Vector3 = BABYLON.Vector3.Zero();
    private _direction : BABYLON.Vector3 = BABYLON.Vector3.Zero();
    
    public speed : number = 0.5;
    public maxRange : number = 40;
    
    private _updateCall : () => void;
    
    constructor(game, pos : BABYLON.Vector3, dir:BABYLON.Vector3) {
        super('__bullet__', game.scene);
        this._game = game;
        
        this._model = BABYLON.MeshBuilder.CreateSphere('__bullet__', {diameter:1}, this.getScene());
        this._model.parent = this;
        this._model.ellipsoid = BABYLON.Vector3.Zero();
        
        this.position.copyFrom(pos);
        this._initialPosition.copyFrom(pos);
        this._direction.copyFrom(dir);
        
        this.ellipsoid = this._model.getBoundingInfo().boundingBox.extendSize.clone().multiplyByFloats(1,0.5,1);
        
        this._updateCall = this._update.bind(this);
        this._game.scene.registerBeforeRender(this._updateCall);
    }
        
    
    private _update() {
        
        this.moveWithCollisions(this._direction.scale(this.speed));

        // Compute distance travelled
        let dist = BABYLON.Vector3.DistanceSquared(this._initialPosition, this.position);
        if (dist > this.maxRange) {
            // Destroy it
            this.dispose();
        }
    }
    
    public dispose() {
        // unregister move
        this._game.scene.unregisterBeforeRender(this._updateCall);
        super.dispose();
    }
}