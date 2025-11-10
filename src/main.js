import log from "./core/log.js"
import { TokenDistanceCalulation } from "./small/TokenDistanceCalulation.js"
import { LookAtTargets } from "./small/LookAtTargets.js"
import { RemoveWaypointBinding } from "./small/RemoveWaypointBinding.js"
import { MODULE_ID } from "./core/meta.js"

window.andael = {}

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

    libWrapper.register('andaels-tweaks', 'Token.prototype.getShape', function(wrapped)
    {
        if (!this.scene.grid.isGridless || this.document.shape != 0)
            return wrapped()

        const { width } = this.document.getSize()
        const { scaleX } = this.document.texture
        return new PIXI.Circle(width / 2, width / 2, Math.abs(scaleX) * width / 2)
    }, 'MIXED')

    libWrapper.register(MODULE_ID, "Scene.prototype.view", async function(wrapped, noAnim)
    {
        if (noAnim || this == canvas.scene)
            return await wrapped()

        await coverCanvas(true, 350)
        await wrapped()
        await delay(16)
        await coverCanvas(false, 1000)

        await delay(650)
        if (this == canvas.scene && !this.getFlag(MODULE_ID, "noAreaTitle"))
        {
            if (this.navName?.length)
                showAreaTitle(this.navName)
            else
                showAreaTitle(this.name)
        }

        return this
    }, "WRAPPER")
})

function delay(ms)
{
    return new Promise(resolve =>
    {
        window.setTimeout(resolve, ms)
    })
}

Hooks.on("refreshToken", function(token)
{
    if (token.document.shape == 4)
        token.document.update({ shape: 0 })
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
    socket.register('showAreaTitle', showAreaTitle)
    socket.register('showChapterTitle', showChapterTitle)
    socket.register('coverCanvas', coverCanvas)

    let lastRegionTitle
    window.andael.setRegionTitle = function(event, title)
    {
        if (event.user.id != game.user.id)
            return

        if (lastRegionTitle != title)
        {
            showAreaTitle(title)
            lastRegionTitle = title
        }
    }

    window.andael.showAreaTitle = function(title)
    {
        if (game.user.isGM)
            socket.executeForEveryone('showAreaTitle', title)
    }

    window.andael.showChapterTitle = async function(h1, h2, nextMap)
    {
        if (game.user.isGM)
        {
            socket.executeForEveryone("showChapterTitle", h1, h2, nextMap)
        }
    }

    window.andael.coverCanvas = function(cover, time)
    {
        if (game.user.isGM)
            socket.executeForEveryone('coverCanvas', cover, time)
    }
})

function showAreaTitle(title)
{
    let element = $('#andael-area-title')
    if (!element.length)
        element = $('<div id="andael-area-title"></div>').appendTo($('body'))

    element
        .stop(true)
        .hide()

    element.text(title)
        .fadeIn(1000)
        .delay(4000)
        .fadeOut(1000)
}

async function showChapterTitle(h1, h2, nextMap)
{
    let element = $("#andael-chapter-title")
    if (!element.length)
        element = $("<div id='andael-chapter-title'><div></div><div></div></div>").appendTo($("body"))

    const bothDivs = element.find("div")
    const div1 = element.find("div:first-child")
    const div2 = element.find("div:last-child")

    element.stop(true).hide()
    bothDivs.stop(true).show().css({ opacity: 0 })

    div1.text(h1)
    div2.text(h2)

    element.fadeIn(1000)
    div1.delay(1500).animate({ opacity: 1 }, 1000)
    div2.delay(3500).animate({ opacity: 1 }, 1000)

    await delay(5000)
    game.scenes.get(nextMap).view(true)

    await delay(2500)
    bothDivs.fadeOut(1000)
    element.delay(1000).fadeOut(3000)
}

/**
 *
 * @param {boolean} cover
 * @param {number} ms
 * @returns {Promise}
 */
function coverCanvas(cover, ms)
{
    let element = $('#andael-canvas-cover')
    if (!element.length)
        element = $('<div id="andael-canvas-cover" style="display: none;"></div>').appendTo($('body'))

    element
        .stop(true)

    return new Promise((resolve) =>
    {
        if (cover)
            element.fadeIn(ms, 'linear', resolve)
        else
            element.fadeOut(ms, 'linear', resolve)
    })
}

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
