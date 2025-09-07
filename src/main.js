import log from "./core/log.js"

const MODULE_ID = "andaels-tweaks"

class SetWorldSettings extends foundry.applications.api.DialogV2
{
    constructor()
    {
        super({
            window: { title: "Overwrite World Settings?" },
            content: "This cannot be undone.",
            buttons: [
                {
                    action: "yes",
                    icon: "fa-solid fa-check",
                    label: "Do it!",
                    callback: applyAllSettings,
                },
                {
                    action: "no",
                    icon: "fa-solid fa-xmark",
                    label: "Cancel",
                    default: true,
                },
            ],
        })
    }
}

Hooks.once("init", function()
{
    game.settings.registerMenu("andaels-tweaks", "setWorldSettings", {
        name: "Modify your world settings to align with Andael’s preferences.",
        label: "Overwrite World Settings",
        type: SetWorldSettings,
        restricted: true,
    })

    game.keybindings.register("andaels-tweaks", "removeWaypoint", {
        name: "Remove Waypoint",
        editable: [{ key: "KeyX" }],
        onDown: removeWaypoint,
    })
})

/**
 * @param {any} ctx
 */
function removeWaypoint(ctx)
{
    const layer = canvas.activeLayer
    if (layer instanceof foundry.canvas.layers.TokenLayer)
    {
        if (layer._draggedToken)
        {
            layer._draggedToken._onDragClickRight(ctx.event)
            return true
        }
    }
    return false
}

async function applyAllSettings()
{
    try
    {
        await game.settings.set("disable-mouse-wheel-sliders", "disable-mouse-wheel-inputs", true)
        await ForceClientSettings.forceSetting("disable-mouse-wheel-sliders.disable-mouse-wheel-inputs", "soft")

        await game.settings.set("disable-mouse-wheel-sliders", "disable-mouse-wheel-sliders", true)
        await ForceClientSettings.forceSetting("disable-mouse-wheel-sliders.disable-mouse-wheel-sliders", "hard")

        ui.notifications.info("Andael’s Tweaks has overwritten all settings.")

        const settingsDialog = foundry.applications.instances.get("settings-config")
        settingsDialog.render()
    }
    catch (ex)
    {
        log.error(ex)
    }
}
