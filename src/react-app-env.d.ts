/// <reference types="react-scripts" />

// We are importing the Whisk SDK globally in the HTML
declare const whisk: any;

// TODO: Remove this if we have types for this package
declare module "parse-fraction" {
  export = index;
  declare function index(str: string, options?: any): any;
}

// TODO: Remove this if we have types for this package
declare module "@react-mock/state" {
  export interface StateMockProps {
    state: object;
  }

  export declare class StateMock extends React.Component<StateMockProps> {}
}
