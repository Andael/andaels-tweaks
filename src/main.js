import log from './utils/log.js'
import * as imageOffset from './aspects/image-offset.js'
import * as improvedQuestLog from './aspects/improved-quest-log.js'
import * as instantTokenPreview from './aspects/instant-token-preview.js'

Hooks.on('renderTokenConfig', function(app)
{
    imageOffset.addFieldsTo(app)
    instantTokenPreview.enableFor(app)
    log(`Updated dialog ‘${app.title}’`)
})

Hooks.once('init', function blah()
{
    improvedQuestLog.registerControls()
})
