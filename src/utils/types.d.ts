interface Hooks {
    ready(): void
    refreshToken(token: Token, options: unknown): void
    renderTokenConfig(app: TokenConfig, html: JQuery, options: unknown): void
}

declare const Hooks: {
    on<K extends keyof Hooks>(name: K, fn: Hooks[K]): void
}

interface JQuery extends ArrayLike<HTMLElement> {
    after(newHtml: string): unknown
    closest(selector: string): JQuery
    find(selector: string): JQuery
    off: JQuery['on']
    on<K extends keyof HTMLElementEventMap>(
        eventName: K,
        listener: (this: unknown, ev: HTMLElementEventMap[K]) => any): this
    siblings(selector: string): JQuery
    text(fn: (i: number, str: string) => string): this
    trigger<K extends keyof HTMLElementEventMap>(eventName: K): this
    val(value: string): this
}

declare const $: {
    (element: HTMLElement): JQuery
}

declare namespace foundry.data.validators {
    export function isColorString(str: string): boolean
}

interface Token {
    mesh: TokenMesh
    document: TokenDocument
}

interface TokenConfig {
    element: JQuery
    title: string
    token: TokenDocument
    setPosition(): void
}

interface TokenDocument {
    flags: {
        'andaels-tweaks'?: {
            offset?: { x?: number, y?: number }
        }
    }
    texture: { scaleX: number, scaleY: number }
}

declare class TokenMesh {
    pivot: {
        set(x: number, y: number): void
    }
    texture: {
        width: number
        height: number
    }
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
