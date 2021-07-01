declare module 'newton-raphson-method' {
  function nr(
    f: (x: number) => number,
    fp?: (x: number) => number,
    x0: number,
    options?: {
      tolerance?: number,
      epsilon?: number,
      maxIterations?: number,
      h?: number,
      verbose?: boolean,
    },
  ): number;

  export default nr;
}
