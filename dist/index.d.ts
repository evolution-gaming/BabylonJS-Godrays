import { Color3, Mesh, Scene } from "babylonjs";
export declare const winConfig: {
    scale: number;
    colors: Color3[];
    minSpeed: number;
    maxSpeed: number;
    density: number;
};
export declare const multConfig: {
    scale: number;
    colors: Color3[];
    minSpeed: number;
    maxSpeed: number;
    density: number;
};
export interface GodraysConfig {
    colors: Array<Color3>;
    scale: number;
    minSpeed: number;
    maxSpeed: number;
    density: number;
}
export declare class Godrays extends Mesh {
    private layers;
    private rays;
    private aimScale;
    private layersNumber;
    private raysNumber;
    private raysLength;
    private raysMinWidth;
    private raysMaxWidth;
    private raysMinLength;
    private raysMaxLength;
    private raysMinAlpha;
    private raysMaxAlpha;
    private density;
    private minRotationSpeed;
    private maxRotationSpeed;
    private colors;
    private layersRotationSpeeds;
    private rotating;
    constructor(scene: Scene);
    initRender(): void;
    start(config: GodraysConfig): void;
    stop(): void;
    setConfig(config: GodraysConfig): void;
    setDensity(density: number): void;
    setSpeed(minSpeed: number, maxSpeed: number): void;
    setRaysScale(scale: number): void;
    setColors(colors: Array<Color3>): void;
    createLayers(): void;
    createLayer(): Mesh;
    rotateLayersAndInterpolateScale(): void;
    createRay(centerWidth: number, edgeWidth: number, length: number): Mesh;
    getRandomColorsData(): number[];
}
export default Godrays;
