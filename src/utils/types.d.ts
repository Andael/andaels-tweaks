interface Hooks {
    ready(): void
    renderTokenConfig(app: TokenConfig, html: JQuery, options: unknown): void
}

declare const Hooks: {
    on<K extends keyof Hooks>(name: K, fn: Hooks[K]): void
}

interface JQuery extends ArrayLike<HTMLElement> {
    after(newHtml: string): unknown
    replaceWith(newHtml: string): unknown
    closest(selector: string): JQuery
    find(selector: string): JQuery
    off: JQuery['on']
    on<K extends keyof HTMLElementEventMap>(
        eventName: K,
        listener: (this: unknown, ev: HTMLElementEventMap[K]) => any): this
    text(fn: (i: number, str: string) => string): this
    trigger<K extends keyof HTMLElementEventMap>(eventName: K): this
}

declare const $: {
    (element: HTMLElement): JQuery
}

declare namespace foundry.data.validators {
    export function isColorString(str: string): boolean
}

interface TokenConfig {
    element: JQuery
    title: string
    setPosition(): void
}

interface NotifyOptions {
    permanent?: boolean
    localize?: boolean
    console?: boolean
}

type NotifyFunction = (message: string, options?: NotifyOptions) => number

declare namespace ui.notifications {
    const error: NotifyFunction
    const warn: NotifyFunction
}

declare namespace foundry.applications.elements {
    class HTMLColorPickerElement {
        value: string
    }
}
