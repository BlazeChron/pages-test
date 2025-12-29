export default `
precision mediump float;
uniform float uTime;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

uniform sampler2D uTexture;

void main() {
  vec3 color;
  float time = uTime / 4.0;
  vec2 frame0Pos = vUv / vec2(3, 1);
  vec2 frame1Pos = vUv / vec2(3, 1) + vec2(1.0 / 3.0, 0);
  vec2 frame2Pos = vUv / vec2(3, 1) + vec2(2.0 / 3.0, 0);

  if (fract(time) > 0.99) {
    //color = texture2D(uTexture, vUv / vec2(3, 1)).xyz;
    color = texture2D(uTexture, frame2Pos).xyz;
  } else if (fract(time) > 0.995) {
    //color = texture2D(uTexture, vUv / vec2(3, 1) + fract(vec2(uTime))).xyz;
    color = texture2D(uTexture, frame1Pos).xyz;
  } else {
    color = texture2D(uTexture, frame0Pos).xyz;
  }

  gl_FragColor = vec4(color, 1.0);
}`
