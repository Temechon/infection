class Enemy extends GameObject{
    public model : BABYLON.AbstractMesh;

    public speed : number = 1;
    public hp : number = 10;

    private _updateCall : () => void;

    constructor (model, game:Game) {

        super('__enemy__', game);

        model.parent = this;
        model.ellipsoid = BABYLON.Vector3.Zero();
        this._updateCall = this._update.bind(this);
        model.checkCollisions = true;
        this.excludedMeshesForCollisions.push(model); 

        this.ellipsoid = model.getBoundingInfo().boundingBox.extendSize.clone().multiplyByFloats(1,0.5,1);

        // this.debug(2, this);
        this._game.scene.registerBeforeRender(this._updateCall);
    }

    private _update() {
        // get the direction vector
        var colliderPosition = this._game.player.position;
        var dir = colliderPosition.subtract(this.position);
        dir.normalize();
        dir.y = 0;
        var dest = dir.scale(0.015).scale(this.speed*2);
        this.look(this._game.player.position);
        this.moveWithCollisions(dest);
    }
    
    /**
     * Damage this enemy. If hp comes to 0, he dies.
     */
    public hit(damage:number) {
        this.hp -= damage;
        if (this.hp <=0) {
            this.dispose();
        }
    }

    public look (pos) {
        var dv = pos.subtract(this.position);
        var yaw = -Math.atan2(dv.z, dv.x) - Math.PI / 2;
        this.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(yaw, 0, 0);
    }
}