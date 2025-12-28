export default `
precision mediump float;
uniform float uTime;
uniform bool uIsFocused;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

uniform sampler2D uTexture;
const float PI = 3.14159265358979323846;

void main() {
  vec3 color;
  vec2 uv = vUv - vec2(0.5, 0.5);
  float angle = atan(uv.y, uv.x); //-PI to PI
  float time = uTime * 2.0;
  //float isFocused = uIsFocused ? 1.0 : 0.0;
  bool isFocused = uIsFocused;

  float timeAngle = fract(time) * 2.0 * PI - PI; //-PI to PI

  //shift angle to behind the time
  if (angle > timeAngle) {
    angle -= 2.0 * PI;
  }
  float displacementAngle = timeAngle - angle; //0 to 2PI
  // split circle into 9 segments of 2PI/9, into an integer
  float segmentIndex = floor(displacementAngle * 9.0 / 2.0 / PI);
  // only color blue if index mod 3 is not 0 i.e. every third segment is blank
  float blue = step(0.1, mod(segmentIndex, 3.0));

  color = vec3(0.0, blue, blue);
  // bounded step function inbetween ranges 0.0 to 0.5
  float baseAlpha = 0.5;
  float focusedAlpha = 0.8;
  float max = 0.5;
  float base = 0.4;
  float low = 0.3;
  float high = 0.4;
  if (isFocused) {
    gl_FragColor = vec4(color, focusedAlpha * step(0.5, blue) * step(low, length(uv)) * step(max - high, max - length(uv)));
  } else {
    gl_FragColor = vec4(color, baseAlpha * step(0.5, blue) * step(base, length(uv)));
  }

}`
