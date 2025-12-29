export default `
uniform float uTime;
uniform float leftEndPosition;
uniform float rightEndPosition;
uniform bool uIsFocused;
varying vec3 vPosition;

void main() {
  float time = uTime;
  vec3 position = vPosition;
  vec3 color = vec3(0.0, 1.0, 1.0);

  // time between 0 and 1
  float ratio = (position.x - leftEndPosition) / (rightEndPosition - leftEndPosition);

  // -0.001 is to fix points on ratio=0 showing on the screen
  if (time <= 0.001) {
    gl_FragColor = vec4(color, 0.0);
  } else {
    if (uIsFocused) {
      gl_FragColor = vec4(color, 1.0 - step(time, ratio));
    } else {
      gl_FragColor = vec4(color, 0.8 * (1.0 - step(time, ratio)));
    }
  }
}
`
