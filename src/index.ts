/**
 * @owdproject/angular
 * Official Angular injectable service & RxJS/Signal-compatible stream adapter for @owdproject/core.
 */

import {
  createDesktop,
  DesktopPointerSession,
  type Desktop,
  type DesktopOptions,
  type DesktopSnapshot,
  type WindowInstance,
  type WindowState,
  type ResizeDirection,
} from '@owdproject/core'

export * from '@owdproject/core'

export interface SubscribableStream<T> {
  subscribe(next: (value: T) => void): { unsubscribe(): void }
  getValue(): T
}

export class DesktopAdapterService {
  public readonly desktop: Desktop

  constructor(options?: Desktop | DesktopOptions) {
    this.desktop =
      options && 'windows' in options ? options : createDesktop(options)
  }

  public get snapshot(): DesktopSnapshot {
    return this.desktop.getSnapshot()
  }

  public asStream(): SubscribableStream<DesktopSnapshot> {
    return {
      subscribe: (next: (value: DesktopSnapshot) => void) => {
        const unsub = this.desktop.subscribe(next)
        return { unsubscribe: unsub }
      },
      getValue: () => this.desktop.getSnapshot(),
    }
  }

  public createWindowStream(instance: WindowInstance): SubscribableStream<WindowState> {
    return {
      subscribe: (next: (value: WindowState) => void) => {
        const unsub = instance.subscribe(next)
        return { unsubscribe: unsub }
      },
      getValue: () => instance.getSnapshot(),
    }
  }

  public createPointerHandlers(instance: WindowInstance) {
    return {
      startDrag: (event: PointerEvent) => {
        this.desktop.windows.focusWindow(instance.id)
        const state = instance.getSnapshot()
        const pos = state.position ?? { x: 0, y: 0 }
        const size = state.size ?? { width: 640, height: 480 }
        return DesktopPointerSession.startDrag(event, {
          initialBounds: {
            x: pos.x ?? 0,
            y: pos.y ?? 0,
            width: typeof size.width === 'number' ? size.width : 640,
            height: typeof size.height === 'number' ? size.height : 480,
          },
          workarea: this.desktop.workspaces.workarea,
          onStart: () => instance.startDrag(),
          onMove: (bounds) => instance.setPosition({ x: bounds.x, y: bounds.y }),
          onEnd: (bounds, snapZone) => {
            instance.stopDrag()
            if (snapZone) {
              instance.setLayout(snapZone, this.desktop.workspaces.workarea)
            } else {
              instance.setPosition({ x: bounds.x, y: bounds.y })
            }
          },
          onCancel: () => instance.stopDrag(),
        })
      },
      startResize: (event: PointerEvent, direction: ResizeDirection) => {
        this.desktop.windows.focusWindow(instance.id)
        const state = instance.getSnapshot()
        const pos = state.position ?? { x: 0, y: 0 }
        const size = state.size ?? { width: 640, height: 480 }
        return DesktopPointerSession.startResize(event, {
          direction,
          initialBounds: {
            x: pos.x ?? 0,
            y: pos.y ?? 0,
            width: typeof size.width === 'number' ? size.width : 640,
            height: typeof size.height === 'number' ? size.height : 480,
          },
          workarea: this.desktop.workspaces.workarea,
          onStart: () => instance.startResize(),
          onMove: (bounds) => {
            instance.setPosition({ x: bounds.x, y: bounds.y })
            instance.setSize({ width: bounds.width, height: bounds.height })
          },
          onEnd: (bounds) => {
            instance.stopResize()
            instance.setPosition({ x: bounds.x, y: bounds.y })
            instance.setSize({ width: bounds.width, height: bounds.height })
          },
          onCancel: () => instance.stopResize(),
        })
      },
    }
  }
}
