export default `
uniform float uTime;
uniform bool uIsFocused;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

void main() {
  vec3 color;
  //vec2 uv = vUv - vec2(0.5, 0.5);
  //float time = uTime * 5.0;

  color = vec3(1.0, 1.0, 1.0);

//  if (uIsFocused) {
//    gl_FragColor = vec4(color, 1.0);
//  } else {
//    gl_FragColor = vec4(color, 0.0);
//  }
  gl_FragColor = vec4(color, 0.0);
}`
