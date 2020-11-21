interface IKeyValue {
  [x: string]: any;
}

interface IDecorateHandle {
  (payload: any): any;
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
  getState: (namespace?: string) => any;
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

export interface IEnhanceReduxReturn {
  store: IKeyValue;
  reducers: IKeyValue;
  register: IKeyValue;
  unRegister: IKeyValue;
}

export interface IAction {
  type: string;
  payload: any;
  [x: string]: any;
}

export interface IDefaultReduce {
  (state: any, action: null | IAction): any;
}
