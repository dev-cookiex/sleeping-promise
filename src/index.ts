class SleepingPromise<T> implements Promise<T> {
  private __promise: Promise<T> | null = null
  private __exec = () => {
    return this.__promise ??= new Promise( this.executor )
  }

  [Symbol.toStringTag] = `SleepingPromise ${this.constructor.name}`

  protected eject = () => {
    // @ts-ignore
    delete this.then
    return this
  }

  constructor(
    private executor: (
      resolve: ( value?: T | PromiseLike<T> ) => void,
      reject: ( reason?: any ) => void
    ) => void ) {}

  public then = <TResult1 = T, TResult2 = never>(
    onfulfilled?: ( ( value: T ) => TResult1 | PromiseLike<TResult1> ) | undefined | null,
    onrejected?: ( ( reason: any ) => TResult2 | PromiseLike<TResult2> ) | undefined | null
  ): Promise<TResult1 | TResult2> => this.__exec().then( onfulfilled, onrejected )

  public catch = <TResult = never>(
    onrejected?: ( ( reason: any ) => TResult | PromiseLike<TResult> ) | undefined | null
  ): Promise<T | TResult> => this.__exec().catch( onrejected )

  public finally = (
    onfinally?: ( () => void ) | undefined | null
  ): Promise<T> => this.__exec().finally( onfinally )
}

namespace SleepingPromise {}

export = SleepingPromise
