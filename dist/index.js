"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var babylonjs_1 = require("babylonjs");
var raysNo = 0;
var layersNo = 0;
var godraysNo = 0;
var defaultColors = [
    babylonjs_1.Color3.FromHexString("#FFE061"),
    babylonjs_1.Color3.FromHexString("#FF9649"),
];
var multiplyerColors = [
    babylonjs_1.Color3.FromHexString("#FFE061"),
    babylonjs_1.Color3.FromHexString("#FF9649"),
    babylonjs_1.Color3.FromHexString("#FF5334"),
    babylonjs_1.Color3.FromHexString("#496BFF"),
];
exports.winConfig = {
    scale: 1.3,
    colors: defaultColors,
    minSpeed: 0.002,
    maxSpeed: 0.04,
    density: 1,
};
exports.multConfig = {
    scale: 1,
    colors: multiplyerColors,
    minSpeed: 0.001,
    maxSpeed: 0.03,
    density: 0.8,
};
var minimizedScale = 0.01;
var Godrays = /** @class */ (function (_super) {
    __extends(Godrays, _super);
    function Godrays(scene) {
        var _this = _super.call(this, "godrays" + (godraysNo++), scene) || this;
        _this.layers = [];
        _this.rays = [];
        _this.aimScale = minimizedScale;
        _this.layersNumber = 5;
        _this.raysNumber = 3;
        _this.raysLength = 15;
        _this.raysMinWidth = 0.01;
        _this.raysMaxWidth = 0.6;
        _this.raysMinLength = 5;
        _this.raysMaxLength = 15;
        _this.raysMinAlpha = 0.1;
        _this.raysMaxAlpha = 0.4;
        _this.density = 1;
        _this.minRotationSpeed = 0.002;
        _this.maxRotationSpeed = 0.04;
        _this.colors = defaultColors;
        _this.layersRotationSpeeds = [];
        _this.rotating = false;
        _this.initRender();
        _this.scaling = new babylonjs_1.Vector3(minimizedScale, minimizedScale, minimizedScale);
        _this.colors = defaultColors;
        _this.rotateLayersAndInterpolateScale = _this.rotateLayersAndInterpolateScale.bind(_this);
        _this.setRaysScale = _this.setRaysScale.bind(_this);
        _this.initRender();
        _this.rotateLayersAndInterpolateScale();
        _this.billboardMode = 7;
        return _this;
    }
    Godrays.prototype.initRender = function () {
        this.createLayers();
    };
    Godrays.prototype.start = function (config) {
        this.rotating = true;
        if (config) {
            this.setConfig(config);
        }
        this.scaling = new babylonjs_1.Vector3(minimizedScale, minimizedScale, minimizedScale);
        this.aimScale = config.scale;
    };
    Godrays.prototype.stop = function () {
        this.aimScale = minimizedScale;
        this.rotating = false;
    };
    Godrays.prototype.setConfig = function (config) {
        this.setColors(config.colors);
        this.setRaysScale(config.scale);
        this.setSpeed(config.minSpeed, config.maxSpeed);
        this.setDensity(config.density);
    };
    Godrays.prototype.setDensity = function (density) {
        this.density = density;
        this.rays.forEach(function (ray) {
            var shouldEnable = Math.random() < density;
            ray.setEnabled(shouldEnable);
        });
    };
    Godrays.prototype.setSpeed = function (minSpeed, maxSpeed) {
        var _this = this;
        this.minRotationSpeed = minSpeed;
        this.maxRotationSpeed = maxSpeed;
        this.layers.forEach(function (layer, idx) { return _this.layersRotationSpeeds[idx] = getRandomFloat(_this.minRotationSpeed, _this.maxRotationSpeed); });
    };
    Godrays.prototype.setRaysScale = function (scale) {
        this.scaling = new babylonjs_1.Vector3(scale, scale, scale);
    };
    Godrays.prototype.setColors = function (colors) {
        this.colors = colors;
        var self = this;
        this.rays.forEach(function (ray) {
            var positions = ray.getVerticesData('position');
            var indices = ray.getIndices();
            var vertexData = new babylonjs_1.VertexData();
            vertexData.positions = positions;
            vertexData.indices = indices;
            vertexData.colors = self.getRandomColorsData();
            vertexData.applyToMesh(ray);
        });
    };
    Godrays.prototype.createLayers = function () {
        for (var i = 0; i < this.layersNumber; i++) {
            var layer = this.createLayer();
            this.layers.push(layer);
            layer.position.z = i * 0.1;
            layer.parent = this;
            this.layersRotationSpeeds[i] = getRandomFloat(-this.maxRotationSpeed, this.maxRotationSpeed);
        }
    };
    Godrays.prototype.createLayer = function () {
        var layer = new babylonjs_1.Mesh("layer" + (layersNo++), this.getScene());
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
    };
    Godrays.prototype.rotateLayersAndInterpolateScale = function () {
        var _this = this;
        var currentScaling = this.scaling.x;
        if (currentScaling !== this.aimScale) {
            currentScaling += (this.aimScale - currentScaling) * 0.2;
            this.scaling = new babylonjs_1.Vector3(currentScaling, currentScaling, currentScaling);
        }
        if (this.rotating) {
            this.layers.forEach(function (layer, idx) { return layer.rotation.z += _this.layersRotationSpeeds[idx]; });
        }
        requestAnimationFrame(this.rotateLayersAndInterpolateScale);
    };
    Godrays.prototype.createRay = function (centerWidth, edgeWidth, length) {
        var ray = new babylonjs_1.Mesh("ray" + (raysNo++), this.getScene());
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
        var vertexData = new babylonjs_1.VertexData();
        vertexData.positions = positions;
        vertexData.indices = indices;
        vertexData.colors = colors;
        vertexData.applyToMesh(ray);
        var mat = new babylonjs_1.StandardMaterial("mat", this.getScene());
        mat.alphaMode = babylonjs_1.Engine.ALPHA_ADD;
        ray.material = mat;
        ray.hasVertexAlpha = true;
        this.rays.push(ray);
        return ray;
    };
    Godrays.prototype.getRandomColorsData = function () {
        var randomColorIdx = getRandomInt(0, this.colors.length - 1);
        var randomColor = this.colors[randomColorIdx];
        var randomColorRGB = [randomColor.r, randomColor.g, randomColor.b];
        var transparentColor = randomColorRGB.concat([0]);
        var colors = [];
        for (var i = 0; i < 6; i++) {
            colors = colors.concat(transparentColor);
        }
        // Making right vertices opaque
        colors[3] = 1;
        colors[7] = 1;
        return colors;
    };
    return Godrays;
}(babylonjs_1.Mesh));
exports.Godrays = Godrays;
function getRandomInt(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
}
function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}
exports.default = Godrays;
//# sourceMappingURL=index.js.map