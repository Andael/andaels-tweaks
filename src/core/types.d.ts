declare const ForceClientSettings: any
declare const libWrapper: any
declare const ui: any

declare namespace canvas
{
    const activeLayer: unknown
    const grid: Grid
    const ready: boolean
    const scene: Scene
}

declare namespace Hooks
{
    function on<K extends keyof StaticHooks>(hook: K, callback: StaticHooks[K]): void
    function once<K extends keyof StaticHooks>(hook: K, callback: StaticHooks[K]): void
}

interface StaticHooks
{
    "libWrapper.Ready"(): void
}

interface Grid
{
    distance: number
    sizeX: number
    sizeY: number
}

interface Math
{
    normalizeDegrees(angle: number): number
}

interface User
{
    character: Actor
}

interface Actor
{
    getActiveTokens(): Token[]
}

declare namespace game
{
    const user: User
}

declare namespace foundry.canvas.layers
{
    class TokenLayer
    {
        _draggedToken: Token | null
    }
}

interface Point
{
    x: number
    y: number
}
