class Enemy extends BABYLON.Mesh{
    private _game : Game;
    public model : BABYLON.AbstractMesh;

    public speed : number = 1;

    private _updateCall : () => void;

    constructor (model, game:Game) {

        super('__enemy__', game.scene);
        this._game = game;

        model.parent = this;
        this._updateCall = this._update.bind(this)

        this.ellipsoid = new BABYLON.Vector3(0.5,0.25,0.5).scaleInPlace(2);

        let displayEllipsoid = (elem) => {
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
        displayEllipsoid(this);

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

    public look = function(pos) {
        var dv = pos.subtract(this.position);
        var yaw = -Math.atan2(dv.z, dv.x) - Math.PI / 2;
        this.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(yaw, 0, 0);
    }
}