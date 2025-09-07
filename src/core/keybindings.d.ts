declare namespace game.keybindings
{
    export function register(namespace: string, action: string, data: KeybindingActionConfig): void

    interface KeybindingActionConfig
    {
        name: string
        editable: KeybindingActionBinding[]
        onDown(context: KeyboardEventContext): boolean
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
