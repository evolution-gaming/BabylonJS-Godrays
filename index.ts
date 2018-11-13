import { Color3, Mesh, Scene, Vector3, VertexData, Engine, StandardMaterial } from "babylonjs";

let raysNo = 0;
let layersNo = 0;
let godraysNo = 0;

const defaultColors = [
    Color3.FromHexString("#ffec23"),
    Color3.FromHexString("#ffb71b"),
]

export const defaultConfig = {
    scale: 1.3,
    colors: defaultColors,
    minSpeed: 0.002,
    maxSpeed: 0.04,
    minAlpha: 0.1,
    maxAlpha: 0.4,
    density: 1,
}

export interface GodraysConfig {
    colors: Array<Color3>;
    scale: number;
    minSpeed: number;
    maxSpeed: number;
    minAlpha: number;
    maxAlpha: number;
    density: number;
}

const minimizedScale = 0.01;

export class Godrays extends Mesh {
    private layers: Array<Mesh> = [];
    private rays: Array<Mesh> = [];

    private aimScale = minimizedScale;

    private layersNumber = 5;
    private raysNumber = 6;
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

        this.scaling = new Vector3(minimizedScale, minimizedScale, minimizedScale);
        this.colors = defaultColors;

        this.rotateLayersAndInterpolateScale = this.rotateLayersAndInterpolateScale.bind(this);
        this.setRaysScale = this.setRaysScale.bind(this);

        this.createLayers();
        this.rotateLayersAndInterpolateScale();
    }

    public start(config?: GodraysConfig) {
        this.rotating = true;

        if (config) {
            this.setConfig(config);
        }

        this.aimScale = config && config.scale || 1;
        this.scaling = new Vector3(minimizedScale, minimizedScale, minimizedScale);
    }

    public stop() {
        this.aimScale = minimizedScale;
        this.rotating = false;
    }

    public setConfig(config: GodraysConfig) {
        this.setColors(config.colors);
        this.setRaysScale(config.scale);
        this.setSpeed(config.minSpeed, config.maxSpeed);
        this.setDensity(config.density);

        if (config.minAlpha && config.maxAlpha) {
            this.setAlpha(config.minAlpha, config.maxAlpha);
        }
    }

    public setAlpha(minAlpha: number, maxAlpha: number) {
        this.raysMinAlpha = minAlpha;
        this.raysMaxAlpha = maxAlpha;

        this.rays.forEach(ray => {
            ray.visibility = getRandomFloat(this.raysMinAlpha, this.raysMaxAlpha);
        });
    }

    public setDensity(density: number) {
        this.density = density;
        this.rays.forEach(ray => {
            const shouldEnable = Math.random() < density;
            ray.setEnabled(shouldEnable);
        });
    }

    public setSpeed(minSpeed: number, maxSpeed: number) {
        this.minRotationSpeed = minSpeed;
        this.maxRotationSpeed = maxSpeed;

        this.layers.forEach((layer, idx) => this.layersRotationSpeeds[idx] = getRandomFloat(this.minRotationSpeed, this.maxRotationSpeed));
    }

    public setRaysScale(scale: number) {
        this.aimScale = scale;
        this.scaling = new Vector3(scale, scale, scale);
    }

    public setColors(colors: Array<Color3>) {
        this.colors = colors;

        this.rays.forEach(ray => {
            const positions = ray.getVerticesData('position');
            const indices = ray.getIndices();
            const vertexData = new VertexData();

            vertexData.positions = positions;
            vertexData.indices = indices;
            const randomColor = this.getRandomColor();
            vertexData.colors = this.getColorData(randomColor);

            vertexData.applyToMesh(ray);
        })
    }

    private createLayers() {
        for (let i = 0; i < this.layersNumber; i++) {
            const layer = this.createLayer()
            this.layers.push(layer);
            layer.position.z = i * 0.01;
            layer.parent = this;
            this.layersRotationSpeeds[i] = getRandomFloat(-this.maxRotationSpeed, this.maxRotationSpeed);
        }
    }

    private createLayer() {
        const layer = new Mesh("layer"+(layersNo++), this.getScene());

        for (let i = 0; i < this.raysNumber; i++) {
            const centerWidth = getRandomFloat(this.raysMinWidth, this.raysMaxWidth);
            const edgesWidth = getRandomFloat(this.raysMinWidth, this.raysMaxWidth);
            const length = getRandomFloat(this.raysMinLength, this.raysMaxLength);

            const ray = this.createRay(centerWidth, edgesWidth, length);
            ray.rotation.z = getRandomFloat(0, Math.PI * 2);
            ray.position.z = raysNo * 0.001;
            ray.visibility = getRandomFloat(this.raysMinAlpha, this.raysMaxAlpha);
            ray.parent = layer;
        }
        return layer;
    }

    private rotateLayersAndInterpolateScale() {
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

    private createRay(centerWidth: number, edgeWidth: number, length: number) {
        const ray = new Mesh("ray"+(raysNo++), this.getScene());

        const halfCenterWidth = centerWidth / 2;
        const halfEdgeWidth = edgeWidth / 2;
        const halfLength = length / 2;

        const centerLPoint = [-halfCenterWidth, 0, 0];
        const centerRPoint = [halfCenterWidth, 0, 0];
        const edgeLTPoint = [-halfEdgeWidth, -halfLength, 0];
        const edgeRTPoint = [halfEdgeWidth, -halfLength, 0];
        const edgeLBPoint = [-halfEdgeWidth, halfLength, 0];
        const edgeRBPoint = [halfEdgeWidth, halfLength, 0];

        const positions = [].concat.apply([], [
            centerLPoint,
            centerRPoint,
            edgeLTPoint,
            edgeRTPoint,
            edgeLBPoint,
            edgeRBPoint,
        ]);

        const indices = [2, 3, 1, 0, 2, 1, 5, 4, 0, 1, 5, 0];

        const randomColor = this.getRandomColor();
        const colors = this.getColorData(randomColor);

        const vertexData = new VertexData();

        vertexData.positions = positions;
        vertexData.indices = indices;
        vertexData.colors = colors;
        vertexData.applyToMesh(ray);

        const mat = new StandardMaterial("mat", this.getScene());
        // mat.alphaMode = Engine.ALPHA_ADD;

        mat.specularColor = randomColor;
        mat.ambientColor = randomColor;
        mat.emissiveColor = randomColor;
        mat.diffuseColor = randomColor;

        ray.material = mat;
        ray.hasVertexAlpha = true

        this.rays.push(ray);

        return ray;
    }

    private getRandomColor() {
        const randomColorIdx = getRandomInt(0, this.colors.length - 1);
        return this.colors[randomColorIdx];
    }

    private getColorData(color: Color3) {
        const randomColorRGB = [color.r, color.g, color.b];
        const transparentColor = [...randomColorRGB, 0];

        let colors: Array<number> = [];

        for (let i = 0; i < 6; i++) {
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