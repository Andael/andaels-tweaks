import log from './utils/log.js'
import * as imageOffset from './aspects/image-offset.js'
import * as instantTokenPreview from './aspects/instant-token-preview.js'

window.andael ??= {}

Hooks.on('renderTokenConfig',
    /**
     * @param {TokenConfig} app
     */
    function(app)
    {
        imageOffset.addFieldsTo(app)
        instantTokenPreview.enableFor(app)
        log(`Updated dialog ‘${app.title}’`)
    })

Hooks.once('init', function()
{
    /* improve quest log */ {
        // Add a shortcut (defaults to 'Q') for showing the Quest Log.
        game.keybindings.register('andaels-tweaks', 'open-quest-log', {
            name: 'Open Quest Log',
            editable: [{ key: 'KeyQ' }],
            onDown: () =>
            {
                Hooks.call('ForienQuestLog.Open.QuestLog')
                return true
            },
        })
    }
})

/* improve quest log */ {
    Hooks.on('renderQuestPreview', function(_, html)
    {
        html = $(html)

        if (!game.user.isGM)
        {
            html.find('.tabs').remove()
            html.find('.quest-info').css({ 'display': 'block', 'overflow-y': 'scroll' })
            html.find('.quest-description').css({ height: 'initial', 'margin-right': 8 })
            html.find('.quest-tasks').css({ 'margin-top': 8 })
            html.find('.quest-rewards').remove()
        }
    })
}

/* right-click to save without closing */ {
    function flashWindow(app)
    {
        $(app.element).find('.window-title')
            .stop(true)
            .css({ backgroundColor: 'green' })
            .delay(300)
            .queue(function()
            {
                $(this).css({ backgroundColor: '' })
            })
    }

    function onSubmitRightClicked(app, fn)
    {
        $(app.element).on('contextmenu', 'button[type=submit]', fn)
    }

    Hooks.on('renderFormApplication', function(app)
    {
        if (app.options.closeOnSubmit)
            onSubmitRightClicked(app, function(event)
            {
                flashWindow(app)

                app._onSubmit(event, { preventClose: true })
            })
    })

    Hooks.on('renderApplicationV2', function(app)
    {
        if (app.options.tag == 'form' && app.options.form.closeOnSubmit)
            onSubmitRightClicked(app, function(event)
            {
                flashWindow(app)

                const options = { ...app.options.form, closeOnSubmit: false }
                event.currentTarget = app.element
                app._onSubmitForm(options, event)
            })
    })
}

Hooks.once('ready', function()
{
    /* improve quest log */ {
        /* Make the quest details dialog much smaller. */
        import('../../forien-quest-log/src/view/preview/QuestPreview.js').then(function({ QuestPreview })
        {
            let wrapped = Object.getOwnPropertyDescriptor(QuestPreview, 'defaultOptions').get
            Object.defineProperty(QuestPreview, 'defaultOptions', {
                get()
                {
                    return foundry.utils.mergeObject(wrapped.apply(this), {
                        width: game.user.isGM ? 700 : 500,
                        height: 700,
                    })
                }
            })
        })

    }

    /* improve borders */ {
        // Make the borders circular (this makes them match this campaign’s aesthetic).
        // Also, make them scale according to the texture scale (this makes the bases smaller for
        // Small creatures).
        libWrapper.register('andaels-tweaks', 'Token.prototype.getShape', function()
        {
            const { width, height } = this.getSize()
            const { scaleX, scaleY } = this.document.texture
            return new PIXI.Ellipse(width / 2, height / 2, scaleX * width / 2, scaleY * height / 2)
        }, 'OVERRIDE')

        // Patch _overlapsSelection (which doesn’t work with ellipses). We’ll just use the token’s
        // bounds instead (even though it isn’t circular and doesn’t respect texture scale).
        libWrapper.register('andaels-tweaks', 'Token.prototype._overlapsSelection', function(rectangle)
        {
            return rectangle.intersects(this.bounds)
        }, 'OVERRIDE')

        // Make borders bigger for this campaign, since the grid size is 300.
        CONFIG.Canvas.objectBorderThickness = 10
    }

    // foundry.applications.sheets.AmbientLightConfig.DEFAULT_OPTIONS.form.closeOnSubmit = false;
    TooltipManager.TOOLTIP_ACTIVATION_MS = 1000

    /* fancy transitions */ {
        let viaTeleportRegion = false

        const GRAVEYARD = 'idCqkHlng6eTJyJs'
        const GHOUL_WARRENS = 'g76YMfCiDi5JlWrK'

        const APPEAR_MS = {
            [GRAVEYARD + GHOUL_WARRENS]: 3000,
            'default': 500
        }

        libWrapper.register('andaels-tweaks', 'foundry.data.regionBehaviors.TeleportTokenRegionBehaviorType.events.tokenMoveIn', async function(wrapped, ...args)
        {
            // note: needs TOKEN_DELETE and TOKEN_CREATE
            try
            {
                viaTeleportRegion = true
                await wrapped(...args)
            }
            finally
            {
                viaTeleportRegion = false
            }
        }, 'WRAPPER')

        libWrapper.register('andaels-tweaks', 'Scene.prototype.view', async function(wrapped)
        {
            if (viaTeleportRegion)
            {
                const id1 = canvas.scene.id + this.id
                const id2 = this.id

                await Promise.all([
                    game.scenes.preload(this.id),
                    coverCanvas(true, 500)
                ])
                await wrapped()

                await coverCanvas(false, APPEAR_MS[id1] ?? APPEAR_MS[id2] ?? APPEAR_MS.default)
            }
            else
            {
                await wrapped()
            }
        }, 'WRAPPER')
    }
})

let socket

Hooks.once('socketlib.ready', () =>
{
    socket = socketlib.registerModule('andaels-tweaks')
    socket.register('showAreaTitle', showAreaTitle)
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
            element.fadeIn(ms, 'swing', resolve)
        else
            element.fadeOut(ms, 'swing', resolve)
    })
}

Hooks.on('renderPF2EBestiary', function(app, html)
{
    if (app._lastSelected != app.selected.monster)
        $(html).find('input[name="npcData.npcView"][checked]').click()
    app._lastSelected = app.selected.monster

    if (!game.user.isGM)
    {
        $(html).find('input[name="npcData.npcView"]').closest(".toggle-switch").hide()

        const monster = app?.selected?.monster
        if (monster)
        {
            if (!monster?.system?.notes?.public?.revealed)
                $(html).find('.bestiary-tab[data-tab=lore]').remove()

            const spellEntries = monster?.system?.spells?.entries
            if (spellEntries && !Object.values(spellEntries).some(e => e.revealed))
                $(html).find('.bestiary-tab[data-tab=spells]').remove()
        }
    }

    $(html).find('.primary-container.empty').remove()

    $(html).find('.bestiary-tab[data-tab=notes]').remove()
})

/**
 * @param {number} ms
 * @returns {Promise}
 */
function delay(ms)
{
    var promise = new Promise((resolve) =>
    {
        window.setTimeout(resolve, ms)
    })
    return promise
}
