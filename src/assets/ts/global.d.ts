interface Window {
  lenis: any; // windowにlenisを追加するために指定
  velocity: number
  imageIndex: number
  isPlaying: boolean
  isView: boolean
  isDown: boolean
}

declare module '*.glsl' {
  const value: string
  export default value
}