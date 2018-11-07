import { Color3, Mesh, Scene, Vector3, VertexData, Engine, StandardMaterial } from "babylonjs";

let raysNo = 0;
let layersNo = 0;
let godraysNo = 0;

const defaultColors = [
    Color3.FromHexString("#FFE061"),
    Color3.FromHexString("#FF9649"),
]

const multiplyerColors = [
    Color3.FromHexString("#FFE061"),
    Color3.FromHexString("#FF9649"),
    Color3.FromHexString("#FF5334"),
    Color3.FromHexString("#496BFF"),
]

export const winConfig = {
    scale: 1.3,
    colors: defaultColors,
    minSpeed: 0.002,
    maxSpeed: 0.04,
    density: 1,
}

export const multConfig = {
    scale: 1,
    colors: multiplyerColors,
    minSpeed: 0.001,
    maxSpeed: 0.03,
    density: 0.8,
}

export interface GodraysConfig {
    colors: Array<Color3>;
    scale: number;
    minSpeed: number;
    maxSpeed: number;
    density: number;
}

const minimizedScale = 0.01;

export class Godrays extends Mesh {
    private layers: Array<Mesh> = [];
    private rays: Array<Mesh> = [];
    private aimScale = minimizedScale;
    private layersNumber = 5;
    private raysNumber = 3;
    private raysLength = 15;
    private raysMinWidth = 0.01;
    private raysMaxWidth = 0.6;
    private raysMinLength = 5;
    private raysMaxLength = 15;
    private raysMinAlpha = 0.1;
    private raysMaxAlpha = 0.4;
    private density = 1;

    private minRotationSpeed = 0.002;
    private maxRotationSpeed = 0.04;
    private colors = defaultColors;
    private layersRotationSpeeds: Array<number> = [];
    private rotating: boolean = false;

    constructor(scene: Scene) {
        super("godrays" + (godraysNo++), scene);
        this.initRender();

        this.scaling = new Vector3(minimizedScale, minimizedScale, minimizedScale);
        this.colors = defaultColors;

        this.rotateLayersAndInterpolateScale = this.rotateLayersAndInterpolateScale.bind(this);
        this.setRaysScale = this.setRaysScale.bind(this);

        this.initRender();
        this.rotateLayersAndInterpolateScale();
        this.billboardMode = 7;
    }

    initRender() {
        this.createLayers();
    }

    start(config?: GodraysConfig) {
        this.rotating = true;

        if (config) {
            this.setConfig(config);
        }

        this.scaling = new Vector3(minimizedScale, minimizedScale, minimizedScale);
        this.aimScale = config.scale;
    }

    stop() {
        this.aimScale = minimizedScale;
        this.rotating = false;
    }

    setConfig(config: GodraysConfig) {
        this.setColors(config.colors);
        this.setRaysScale(config.scale);
        this.setSpeed(config.minSpeed, config.maxSpeed);
        this.setDensity(config.density);
    }

    setDensity(density: number) {
        this.density = density;
        this.rays.forEach(ray => {
            const shouldEnable = Math.random() < density;
            ray.setEnabled(shouldEnable);
        });
    }

    setSpeed(minSpeed: number, maxSpeed: number) {
        this.minRotationSpeed = minSpeed;
        this.maxRotationSpeed = maxSpeed;

        this.layers.forEach((layer, idx) => this.layersRotationSpeeds[idx] = getRandomFloat(this.minRotationSpeed, this.maxRotationSpeed));
    }

    setRaysScale(scale: number) {
        this.scaling = new Vector3(scale, scale, scale);
    }

    setColors(colors: Array<Color3>) {
        this.colors = colors;
        var self = this;
        this.rays.forEach(ray => {
            var positions = ray.getVerticesData('position');
            var indices = ray.getIndices();
            var vertexData = new VertexData();

            vertexData.positions = positions;
            vertexData.indices = indices;
            vertexData.colors = self.getRandomColorsData();

            vertexData.applyToMesh(ray);
        })
    }

    createLayers() {
        for (var i = 0; i < this.layersNumber; i++) {
            const layer = this.createLayer()
            this.layers.push(layer);
            layer.position.z = i * 0.1;
            layer.parent = this;
            this.layersRotationSpeeds[i] = getRandomFloat(-this.maxRotationSpeed, this.maxRotationSpeed);
        }
    }

    createLayer() {
        var layer = new Mesh("layer"+(layersNo++), this.getScene());

        for (var i = 0; i < this.raysNumber; i++) {
            var centerWidth = getRandomFloat(this.raysMinWidth, this.raysMaxWidth);
            var edgesWidth = getRandomFloat(this.raysMinWidth, this.raysMaxWidth);
            var length = getRandomFloat(this.raysMinLength, this.raysMaxLength);

            var ray = this.createRay(centerWidth, edgesWidth, 10);
            ray.rotation.z = getRandomFloat(0, Math.PI * 2);
            ray.position.z = raysNo * 0.001;
            ray.visibility = getRandomFloat(this.raysMinAlpha, this.raysMaxAlpha);
            ray.parent = layer;
        }
        return layer;
    }

    rotateLayersAndInterpolateScale() {
        let currentScaling = this.scaling.x;
        if (currentScaling !== this.aimScale) {
            currentScaling += (this.aimScale - currentScaling) * 0.2;
            this.scaling = new Vector3(currentScaling, currentScaling, currentScaling);
        }

        if (this.rotating) {
            this.layers.forEach((layer, idx) => layer.rotation.z += this.layersRotationSpeeds[idx]);
        }

        requestAnimationFrame(this.rotateLayersAndInterpolateScale);
    }

    createRay(centerWidth: number, edgeWidth: number, length: number) {
        var ray = new Mesh("ray"+(raysNo++), this.getScene());

        var halfCenterWidth = centerWidth / 2;
        var halfEdgeWidth = edgeWidth / 2;
        var halfLength = length / 2;

        var centerLPoint = [-halfCenterWidth, 0, 0];
        var centerRPoint = [halfCenterWidth, 0, 0];
        var edgeLTPoint = [-halfEdgeWidth, -halfLength, 0];
        var edgeRTPoint = [halfEdgeWidth, -halfLength, 0];
        var edgeLBPoint = [-halfEdgeWidth, halfLength, 0];
        var edgeRBPoint = [halfEdgeWidth, halfLength, 0];

        var positions = [].concat.apply([], [
            centerLPoint,
            centerRPoint,
            edgeLTPoint,
            edgeRTPoint,
            edgeLBPoint,
            edgeRBPoint,
        ]);

        var indices = [2, 3, 1, 0, 2, 1, 5, 4, 0, 1, 5, 0];

        var colors = this.getRandomColorsData();

        var vertexData = new VertexData();

        vertexData.positions = positions;
        vertexData.indices = indices;
        vertexData.colors = colors;
        vertexData.applyToMesh(ray);

        var mat = new StandardMaterial("mat", this.getScene());
        mat.alphaMode = Engine.ALPHA_ADD;
        ray.material = mat;
        ray.hasVertexAlpha = true

        this.rays.push(ray);

        return ray;
    }

    getRandomColorsData() {
        const randomColorIdx = getRandomInt(0, this.colors.length - 1);
        const randomColor = this.colors[randomColorIdx];

        var randomColorRGB = [randomColor.r, randomColor.g, randomColor.b];
        var transparentColor = [...randomColorRGB, 0];

        var colors: Array<number> = [];

        for (var i = 0; i < 6; i++) {
            colors = colors.concat(transparentColor);
        }

        // Making right vertices opaque
        colors[3] = 1;
        colors[7] = 1;

        return colors;
    }
}

function getRandomInt(min: number, max: number) {
    return min + Math.floor(Math.random() * (max - min + 1));
}

function getRandomFloat(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

export default Godrays;