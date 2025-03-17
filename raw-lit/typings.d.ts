declare module '*.module.css' {
  const sheet: CSSStyleSheet;
  export default sheet;
}
declare module '*.module.scss' {
  const sheet: CSSStyleSheet;
  export default sheet;
}
declare module '*.css' {
  const content: any;
  export default content;
}
declare module '*.scss' {
  const content: any;
  export default content;
}
declare module '*.svg' {
  const content: string;
  export default content;
}
