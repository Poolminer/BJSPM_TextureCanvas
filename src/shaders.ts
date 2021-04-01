import { Effect } from '@babylonjs/core/Materials/effect';

Effect.ShadersStore["textureCanvasVertexShader"] = `
// Attributes
attribute vec2 position;

// Output
varying vec2 vPosition;
varying vec2 vLocalUV;
varying vec2 vWorldUV;

// Uniforms
uniform mat4 rotationMatrix;
uniform vec2 pivotPoint;
uniform vec2 translation;
uniform vec2 scaling;
uniform vec2 skewing;

const vec2 madd = vec2(0.5, 0.5);

void main(void) {
    vec2 skewed = vec2(position.x + skewing.x * position.y, position.y + skewing.y * position.x);
    vec2 transformed = (vec4(skewed * scaling + translation - pivotPoint, 0.0, 0.0) * rotationMatrix).xy + pivotPoint;

    gl_Position = vec4(transformed, 0.0, 1.0);
    
    vPosition = position;
	vLocalUV = position * madd + madd;
    vWorldUV = gl_Position.xy * madd + madd;
}
`;

Effect.ShadersStore["textureCanvasFragmentShader"] = `
precision highp float;

varying vec2 vLocalUV;
varying vec2 vWorldUV;

uniform sampler2D diffuseSampler;
uniform sampler2D opacitySampler;
uniform sampler2D backgroundSampler;

uniform vec4 diffuseSamplingRect;
uniform vec4 opacitySamplingRect;
uniform float opacityTextureIntensity;

void main(void) {
    vec4 backgroundPixel = texture2D(backgroundSampler, vWorldUV);
    vec4 diffusePixel = texture2D(diffuseSampler, vLocalUV * diffuseSamplingRect.zw + diffuseSamplingRect.xy);
    vec4 opacityPixel = texture2D(opacitySampler, vLocalUV * opacitySamplingRect.zw + opacitySamplingRect.xy);
    gl_FragColor = mix(backgroundPixel, diffusePixel, opacityPixel.a * opacityTextureIntensity + (1.0 - opacityTextureIntensity) * diffusePixel.a);
}
`;