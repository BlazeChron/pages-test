export default `
precision mediump float;
uniform float uTime;
//uniform float uSpeed;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

uniform sampler2D uTexture;
const float PI = 3.14159265358979323846;

void main() {
  vec3 color;
  vec2 uv = vUv - vec2(0.5, 0.5);
  float time = uTime * 5.0;

  color = vec3(0.0, 1.0, 1.0);

  if (time <= 0.001) {
    gl_FragColor = vec4(color, 0.0);
  } else {
    gl_FragColor = vec4(color, 0.8 * step(0.5, uTime - uv.y));
  }
}`
