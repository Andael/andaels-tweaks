import log from './utils/log.js'
import * as imageOffset from './aspects/image-offset.js'
import * as instantTokenPreview from './aspects/instant-token-preview.js'

Hooks.on('renderTokenConfig', function(app)
{
    imageOffset.addFieldsTo(app)
    instantTokenPreview.enableFor(app)
    log(`Updated dialog ‘${app.title}’`)
})

Hooks.on('ready', function()
{
    log('Ready')
})
