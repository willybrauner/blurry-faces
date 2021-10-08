import { Signal } from "@solid-js/signal"
import { deferredPromise, TDeferredPromise } from "@wbe/deferred-promise"

const componentName = "ViewManager"
const debug = require("debug")(`front:${componentName}`)

export type TPlayState = "hidden" | "play-out" | "play-in" | "visible"

/**
 * View Manager extended class
 */
class ViewManager {
  /**
   * Current class name extend this ViewManager
   */
  public name: string

  /**
   * Enable "debug"
   */
  public enableDebug = false

  /**
   * ViewManager playState
   */
  public playStateSignal = Signal<[TPlayState, any?]>()

  // ------------------------------------------------------------------------------------- PLAYIN

  private playInDeferred: TDeferredPromise<void>

  public playIn<GArgs = any>(args: GArgs): Promise<void> {
    this.log(this.name, "playIn")
    this.playInDeferred = deferredPromise<void>()
    this.playStateSignal.dispatch("play-in", args)
    return this.playInDeferred.promise
  }

  public playInComplete(): void {
    this.log(this.name, "playIn complete")
    this.playStateSignal.dispatch("visible")
    this.playInDeferred?.resolve()
  }

  // ------------------------------------------------------------------------------------- PLAYOUT

  private playOutDeferred: TDeferredPromise<void>

  public playOut<GArgs = any>(args: GArgs): Promise<void> {
    this.log(this.name, "playOut")
    this.playOutDeferred = deferredPromise<void>()
    this.playStateSignal.dispatch("play-out", args)
    return this.playOutDeferred.promise
  }

  public playOutComplete(): void {
    this.log(this.name, "playOut complete")
    this.playStateSignal.dispatch("hidden")
    this.playOutDeferred?.resolve()
  }

  // ------------------------------------------------------------------------------------- SHOW

  public show(): void {
    this.log(this.name, "show")
    this.playStateSignal.dispatch("visible")
  }

  // ------------------------------------------------------------------------------------- HIDE

  public hide(): void {
    this.log(this.name, "hide")
    this.playStateSignal.dispatch("hidden")
  }

  // -------------------------------------------------------------------------------------

  /**
   * Logs
   * @param rest
   * @private
   */
  private log(...rest) {
    this.enableDebug && debug(rest)
  }
}

export default new ViewManager()
