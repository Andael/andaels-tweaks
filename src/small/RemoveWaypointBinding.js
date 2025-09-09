import { MODULE_ID } from "../core/meta.js"

/**
 * @returns {any | void}
 */
function getDraggedToken()
{
    const activeLayer = canvas.activeLayer
    if (activeLayer instanceof foundry.canvas.layers.TokenLayer)
    {
        return activeLayer._draggedToken
    }
}

export class RemoveWaypointBinding
{
    static register()
    {
        game.keybindings.register(MODULE_ID, "removeWaypoint", {
            name: "Remove Waypoint",
            hint: "This binding only applies when dragging a token.",
            editable: [{ key: "KeyX" }, { key: "Backspace" }],
            onDown: RemoveWaypointBinding.#remove,
            precedence: 0,
        })

        game.keybindings.register(MODULE_ID, "cancelDrag", {
            name: "Cancel Drag",
            hint: "This binding only applies when dragging a token.",
            editable: [{ key: "Escape" }],
            onDown: RemoveWaypointBinding.#removeAll,
            precedence: 0,
        })
    }

    /**
     * @returns {boolean}
     */
    static #remove()
    {
        const draggedToken = getDraggedToken()
        if (draggedToken)
        {
            draggedToken._removeDragWaypoint()
            return true
        }
        return false
    }

    /**
     * @returns {boolean}
     */
    static #removeAll()
    {
        const draggedToken = getDraggedToken()
        if (draggedToken)
        {
            draggedToken._triggerDragLeftCancel()
            return true
        }
        return false
    }
}
