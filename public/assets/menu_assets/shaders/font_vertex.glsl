export default `

varying vec3 vPosition;
void main() {
  vPosition = position.xyz; 
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.0);
}
`
