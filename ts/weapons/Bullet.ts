class Bullet extends GameObject {
        
    private _model : BABYLON.Mesh;
    private _initialPosition : BABYLON.Vector3 = BABYLON.Vector3.Zero();
    private _direction : BABYLON.Vector3 = BABYLON.Vector3.Zero();
    
    public speed : number = 0.5;
    public maxRange : number = 40;
    public strength : number = 1;
    
    private _updateCall : () => void;
    
    constructor(game, pos : BABYLON.Vector3, dir:BABYLON.Vector3) {
        super('__bullet__', game);
        
        this._model = BABYLON.MeshBuilder.CreateSphere('__bullet__', {diameter:1}, this.getScene());
        this._model.parent = this;
        this._model.ellipsoid = BABYLON.Vector3.Zero();
        
        this.position.copyFrom(pos);
        this._initialPosition.copyFrom(pos);
        this._direction.copyFrom(dir);
        
        this.ellipsoid = this._model.getBoundingInfo().boundingBox.extendSize.clone().multiplyByFloats(1,0.5,1);
        this.debug(2, this);
        
        this._updateCall = this._update.bind(this);
        this._game.scene.registerBeforeRender(this._updateCall);
        
        this.onCollideObservable.add(this._onCollision.bind(this));
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
    
    /**
     * On collision, do something if it's an enemy. Otherwise, destroy it
     */
    private _onCollision (mesh:BABYLON.Mesh) {
            console.log(mesh.name)
        if (mesh instanceof Enemy) {
            let enemy = mesh as Enemy;
            enemy.hit(this.strength);
        }
        this.dispose();
        
    }
}