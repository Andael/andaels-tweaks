import { MODULE_ID } from "../core/meta.js"

export class RemoveWaypoint
{
    static register()
    {
        game.keybindings.register(MODULE_ID, "removeWaypoint", {
            name: "Remove Waypoint",
            editable: [{ key: "KeyX" }],
            onDown: RemoveWaypoint.#onPress,
        })
    }

    /**
     * @param {game.keybindings.KeyboardEventContext} ctx
     * @returns {boolean}
     */
    static #onPress(ctx)
    {
        const activeLayer = canvas.activeLayer
        if (activeLayer instanceof foundry.canvas.layers.TokenLayer)
        {
            if (activeLayer._draggedToken)
            {
                activeLayer._draggedToken._onDragClickRight(ctx.event)
                return true
            }
        }
        return false
    }
}
