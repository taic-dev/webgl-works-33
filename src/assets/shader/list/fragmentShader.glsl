uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;
uniform vec2 uPlaneSize;
uniform sampler2D uTexture;
uniform vec2 uTextureSize;
uniform float uAlpha;
uniform float uVelocity;

varying vec2 vUv;

void main() {
  // アスペクトを計算
  float planeAspect = uPlaneSize.x / uPlaneSize.y;
  float textureAspect = uTextureSize.x / uTextureSize.y;

  // 画像のアスペクトとプレーンのアスペクトを比較し、短い方に合わせる
  vec2 ratio = vec2(
    min(planeAspect / textureAspect, 1.0),
    min((1.0 / planeAspect) / (1.0 / textureAspect), 1.0)
  );

  // 計算結果を用いて補正後のuv値を生成
  vec2 fixedUv = vec2(
    (vUv.x - 0.5) * ratio.x + 0.5,
    (vUv.y - 0.5) * ratio.y + 0.5
  );

  float velocity=uVelocity*0.0005;

  float r = texture2D(uTexture, fixedUv+velocity+uMouse.x*0.01).r;
  float g = texture2D(uTexture, fixedUv+velocity+uMouse.y*0.01).g;
  float b = texture2D(uTexture, fixedUv).b;

  gl_FragColor = vec4(vec3(r, g, b), uAlpha);
}