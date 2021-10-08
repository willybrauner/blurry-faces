import { Signal } from "@solid-js/signal"
import { deferredPromise, TDeferredPromise } from "@wbe/deferred-promise"

const componentName = "ViewManager"
const debug = require("debug")(`front:${componentName}`)

export type TPlayState =
  | "unmount"
  | "mount"
  | "hidden"
  | "play-out"
  | "play-in"
  | "visible"

/**
 * View Manager extended class
 */
export default class ViewManager {
  constructor(name: string | null = null, enableDebug: boolean = false) {
    this.name = name
    this.enableDebug = enableDebug
  }

  /**
   * Current class name extend this ViewManager
   */
  public name: string

  /**
   * Enable "debug"
   */
  public enableDebug: boolean

  /**
   * ViewManager playState
   */
  public playStateSignal = Signal<[TPlayState, any?]>()

  // ------------------------------------------------------------------------------------- UNMOUNT

  private unmountDeferred: TDeferredPromise<void>

  public unmount<GArgs = any>(args: GArgs): Promise<void> {
    this.log(this.name, "mount")
    this.unmountDeferred = deferredPromise<void>()
    this.playStateSignal.dispatch("unmount", args)
    return this.unmountDeferred.promise
  }

  public unmountComplete(): void {
    this.log(this.name, "unmount complete")
    this.unmountDeferred?.resolve()
  }

  // ------------------------------------------------------------------------------------- MOUNT

  private mountDeferred: TDeferredPromise<void>

  public mount<GArgs = any>(args?: GArgs): Promise<void> {
    this.log(this.name, "mount")
    this.mountDeferred = deferredPromise<void>()
    this.playStateSignal.dispatch("mount", args)
    return this.mountDeferred.promise
  }

  public mountComplete(): void {
    this.log(this.name, "mount complete")
    this.mountDeferred?.resolve()
  }

  // ------------------------------------------------------------------------------------- HIDE

  public hide(): void {
    this.log(this.name, "hide")
    this.playStateSignal.dispatch("hidden")
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

  // ------------------------------------------------------------------------------------- SHOW

  public show(): void {
    this.log(this.name, "show")
    this.playStateSignal.dispatch("visible")
  }

  // ------------------------------------------------------------------------------------- HELPER

  /**
   * Logs
   * @param rest
   * @private
   */
  private log(...rest) {
    this.enableDebug && debug(rest)
  }
}
