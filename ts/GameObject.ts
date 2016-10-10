class GameObject extends BABYLON.Mesh {
    
    protected _game : Game;
    
    
    constructor(name:string, game:Game) {
        super(name, game.scene);
        this._game = game;
    }

    
    /**
     * Draw the local axis of the player
     */
    public debug (size : number, mesh : BABYLON.AbstractMesh) {

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