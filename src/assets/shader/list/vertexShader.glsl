uniform float uVelocity;
uniform float uTime;
varying vec2 vUv;

float PI = 3.141592653589793;

vec3 curve(vec3 pos, vec2 vUv) {
  float velocity = clamp(uVelocity, -20.0, 20.0);
  pos.z=sin(pos.y*3.5+uTime)*velocity;
  pos.z*=1.5;

  return pos;
}

void main() {
  vUv = uv;
  vec3 pos = position;

  vec3 finalPosition = curve(pos, vUv);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPosition, 1.0);
}