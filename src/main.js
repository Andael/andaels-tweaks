import log from "./core/log.js"
import { TokenDistanceCalulation } from "./small/TokenDistanceCalulation.js"
import { LookAtTargets } from "./small/LookAtTargets.js"
import { RemoveWaypointBinding } from "./small/RemoveWaypointBinding.js"
import { MODULE_ID } from "./core/meta.js"

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

Hooks.once("libWrapper.Ready", function()
{
    TokenDistanceCalulation.applyFix()
})

Hooks.once("init", function()
{
    game.settings.registerMenu("andaels-tweaks", "setWorldSettings", {
        name: "Modify your world settings to align with Andael’s preferences.",
        label: "Overwrite World Settings",
        type: SetWorldSettings,
        restricted: true,
    })

    RemoveWaypointBinding.register()
})

/** @type {any} */
let socket

Hooks.once("socketlib.ready", function()
{
    socket = socketlib.registerModule(MODULE_ID)
})

LookAtTargets.registerHooks()

async function applyAllSettings()
{
    try
    {
        // game.settings.set("healthEstimate", "core.menuSettings.gradient", { colors:['#FF0000','#FFC403','#FFFF00','#FFFF00','#00FF00'], positions:[0,0.49,0.51,0.75,1] })

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
