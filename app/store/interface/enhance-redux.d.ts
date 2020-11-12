interface IKeyValue {
  [x: string]: any;
}

export interface ReducerInjectParams {
  state: IKeyValue;
  rootState: IKeyValue;
}

type ReducerPayload = {
  [x: string]: any;
};

interface ReducerType {
  (inject: ReducerInjectParams, payload: any): any;
}

export type EffectsInjectParams = {
  state: IKeyValue;
  rootState: IKeyValue;
  call: (path: string, payload: any) => any;
  push: (path: string, payload: any) => any;
};

type EffectsPayload = {
  [x: string]: any;
};

export type EffectsType = (a: EffectsInjectParams, b: EffectsPayload) => any;

export interface IModal {
  namespace: string;
  state?: IKeyValue;
  reducers?: {
    [x: string]: ReducerType;
  };
  effects?: {
    [x: string]: EffectsType;
  };
}

// store, reducers, registry, unRegistry

export interface IEnhanceReduxReturn {
  store: IKeyValue;
  reducers: IKeyValue;
  registry: IKeyValue;
  unRegistry: IKeyValue;
}

declare module 'enhance-redux' {
  export default function enhanceRedux(
    models: IModal[],
    options: any
  ): IEnhanceReduxReturn;
}
