type MaybeArray<T> = T extends undefined | null | never
  ? []
  : T extends any[]
    ? T['length'] extends 1
      ? [data: T[0]]
      : T
    : [data: T]

export interface TypesafeEventEmitter<
  T extends Record<string | symbol, MaybeArray<any>>,
  Event extends Exclude<keyof T, number> = Exclude<keyof T, number>,
> extends NodeJS.EventEmitter {
  addListener<E extends Event> (eventName: E, listener: (...args: MaybeArray<T[E]>) => void): this
  removeListener<E extends Event> (eventName: E, listener: (...args: MaybeArray<T[E]>) => void): this
  removeAllListeners<E extends Event> (event?: E): this
  setMaxListeners(n: number): this
  getMaxListeners(): number
  listeners<E extends Event> (eventName: E): Function[]
  rawListeners<E extends Event> (eventName: E): Function[]
  listenerCount<E extends Event> (eventName: E, listener?: Function): number
  prependListener<E extends Event> (eventName: E, listener: (...args: MaybeArray<T[E]>) => void): this
  prependOnceListener<E extends Event> (eventName: E, listener: (...args: MaybeArray<T[E]>) => void): this
  eventNames(): (Event)[]
  on<E extends Event>(eventName: E, listener: (...data: MaybeArray<T[E]>) => void): this
  once<E extends Event>(eventName: E, listener: (...args: MaybeArray<T[E]>) => void): this
  emit<E extends Event>(eventName: E, ...args: MaybeArray<T[E]>): boolean
  off<E extends Event>(eventName: E, listener: (...args: MaybeArray<T[E]>) => void): this
}
