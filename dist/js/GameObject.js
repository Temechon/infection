var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GameObject = (function (_super) {
    __extends(GameObject, _super);
    function GameObject(name, game) {
        _super.call(this, name, game.scene);
        this._game = game;
    }
    /**
     * Draw the local axis of the player
     */
    GameObject.prototype.debug = function (size, mesh) {
        mesh.computeWorldMatrix();
        var m = mesh.getWorldMatrix();
        // Axis
        var x = new BABYLON.Vector3(size, 0, 0);
        var y = new BABYLON.Vector3(0, size, 0);
        var z = new BABYLON.Vector3(0, 0, size);
        // Draw an axis of the given color
        var _drawAxis = function (color, start, end) {
            var axis = BABYLON.Mesh.CreateLines("lines", [
                start,
                end
            ], mesh.getScene());
            axis.color = color;
            return axis;
        };
        var xAxis = _drawAxis(BABYLON.Color3.Red(), mesh.getAbsolutePosition(), BABYLON.Vector3.TransformCoordinates(x, m));
        xAxis.parent = mesh;
        var yAxis = _drawAxis(BABYLON.Color3.Green(), mesh.getAbsolutePosition(), BABYLON.Vector3.TransformCoordinates(x, m));
        yAxis.parent = mesh;
        var zAxis = _drawAxis(BABYLON.Color3.Blue(), mesh.getAbsolutePosition(), BABYLON.Vector3.TransformCoordinates(x, m));
        zAxis.parent = mesh;
        // Ellipsoid 
        var ellipsoidMat = mesh.getScene().getMaterialByName("__ellipsoidMat__");
        if (!ellipsoidMat) {
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
    };
    return GameObject;
}(BABYLON.Mesh));
//# sourceMappingURL=GameObject.js.map