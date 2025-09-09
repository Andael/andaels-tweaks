declare const ForceClientSettings: any
declare const Hooks: any
declare const libWrapper: any
declare const ui: any

declare namespace canvas
{
    const activeLayer: unknown
}

declare namespace foundry.canvas.layers
{
    class TokenLayer
    {
        _draggedToken: Token | null
    }
}

interface Token
{
    _removeDragWaypoint(): void
    _triggerDragLeftCancel(): void
}
