interface Window {
  lenis: any; // windowにlenisを追加するために指定
  velocity: number
}

declare module '*.glsl' {
  const value: string
  export default value
}