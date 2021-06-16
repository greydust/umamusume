/// <reference types="react-scripts" />

declare module '*.json' {
  const value: { [key: string]: any };
  export default value;
}
