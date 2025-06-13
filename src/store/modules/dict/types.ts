export interface DictOptions {
  label: string
  value: string
  [key: string]: any
}

export interface DictState {
  [key: string]: Array<DictOptions>
}
