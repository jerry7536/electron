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
> {
  removeListener<E extends Event> (eventName: E, listener: (...args: MaybeArray<T[E]>) => void): this
  removeAllListeners<E extends Event> (event?: E): this
  listeners<E extends Event> (eventName: E): Function[]
  eventNames(): (Event)[]
  on<E extends Event>(eventName: E, listener: (...data: MaybeArray<T[E]>) => void): this
  once<E extends Event>(eventName: E, listener: (...args: MaybeArray<T[E]>) => void): this
  emit<E extends Event>(eventName: E, ...args: MaybeArray<T[E]>): boolean
  off<E extends Event>(eventName: E, listener: (...args: MaybeArray<T[E]>) => void): this
}
