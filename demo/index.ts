import {
    Scene,
    Engine,
    FreeCamera,
    HemisphericLight,
    PointLight,
    MeshBuilder,
    Vector3,
    StandardMaterial,
    Color3,
    Color4
} from "babylonjs";

import { Godrays, defaultConfig } from "../dist/index";

var raf = window.requestAnimationFrame;
var skipProcent = 0.9;
var rafs = 0;

window.requestAnimationFrame = (callback: FrameRequestCallback): number => {
    var skip = Math.random() < skipProcent;

    if (skip) {
        raf(callback);
    } else {
        skippingRaf(callback);
    }
    return rafs++;
}

function skippingRaf(func: FrameRequestCallback) {
    raf(() => {
        window.requestAnimationFrame(func);
    })
}

var canvas = document.getElementById("demo-canvas"); // Get the canvas element
var engine = new Engine(canvas as HTMLCanvasElement, true); // Generate the BABYLON 3D engine

var createScene = function () {

    // Create the scene space
    const scene = new Scene(engine);

    scene.clearColor = Color4.FromColor3(Color3.FromHexString("#22538e"));

    // Add a camera to the scene and attach it to the canvas
    const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
    camera.setTarget(Vector3.Zero());
    camera.attachControl(canvas, true);

    // Add lights to the scene
    const light1 = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);
    const light2 = new PointLight("light2", new Vector3(0, 1, -1), scene);

    // Add and manipulate meshes in the scene
    const sphere = MeshBuilder.CreateSphere("sphere", {diameter:3}, scene);
    const mat = new StandardMaterial("sphereMat", scene);
    mat.diffuseColor = Color3.FromHexString("#FFE061");
    mat.emissiveColor = Color3.FromHexString("#FFE061");
    sphere.material = mat;

    console.log(defaultConfig);

    // Add godrays
    const godrays = new Godrays(scene);
    godrays.position = sphere.position.clone();


    const startButton = document.getElementById("start");
    const stopButton = document.getElementById("stop");

    startButton.addEventListener('mousedown', (e) => {
        godrays.start();
    });

    stopButton.addEventListener('mousedown', (e) => {
        godrays.stop();
    });

    return scene;
};

const scene = createScene(); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
    scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});