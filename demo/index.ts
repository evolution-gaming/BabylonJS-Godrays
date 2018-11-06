import { Godrays, winConfig, multConfig } from "../dist/";
import {
    Scene,
    Engine,
    ArcRotateCamera,
    HemisphericLight,
    PointLight,
    MeshBuilder,
    Vector3,
    StandardMaterial,
    Color3,
    Color4
} from "babylonjs";

var canvas = document.getElementById("demo-canvas"); // Get the canvas element
var engine = new Engine(canvas as HTMLCanvasElement, true); // Generate the BABYLON 3D engine

var createScene = function () {

    // Create the scene space
    var scene = new Scene(engine);

    scene.clearColor = Color4.FromColor3(Color3.FromHexString("#22538e"));

    // Add a camera to the scene and attach it to the canvas
    var camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2,
        new Vector3(0,0,10), scene);

    camera.attachControl(canvas, true);

    // Add lights to the scene
    var light1 = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);
    var light2 = new PointLight("light2", new Vector3(0, 1, -1), scene);

    // Add and manipulate meshes in the scene
    var sphere = MeshBuilder.CreateSphere("sphere", {diameter:3}, scene);
    const mat = new StandardMaterial("sphereMat", scene);
    mat.diffuseColor = Color3.FromHexString("#FFE061");
    mat.emissiveColor = Color3.FromHexString("#FFE061");
    sphere.material = mat;

    // Add godrays
    var godrays = new Godrays(scene);
    godrays.position = sphere.position.clone();


    var startButton = document.getElementById("start");
    var stopButton = document.getElementById("stop");

    startButton.addEventListener('mousedown', (e) => {
        godrays.start(multConfig);
    });

    stopButton.addEventListener('mousedown', (e) => {
        godrays.stop();
    });

    return scene;
};

var scene = createScene(); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
    scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});