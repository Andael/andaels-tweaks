declare namespace game.keybindings
{
    export function register(namespace: string, action: string, data: KeybindingActionConfig): void

    interface KeybindingActionConfig
    {
        name: string
        hint?: string
        editable: KeybindingActionBinding[]
        onDown?(context: KeyboardEventContext): boolean
        onUp?(context: KeyboardEventContext): boolean
        precedence?: 0 | 1 | 2
    }

    interface KeybindingActionBinding
    {
        key: string
    }

    interface KeyboardEventContext
    {
        event: KeyboardEvent
    }
}
