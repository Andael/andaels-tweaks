/**
 * @file Image Offset
 * This feature adds ‘x/y offset’ sliders to the token configuration dialog. These sliders can be
 * used to modify the position of the token image relative to its base.
 */

import log from '../utils/log.js'

/**
 * Adds x/y offset (as sliders) to a TokenConfig dialog.
 * @param {TokenConfig} app Which dialog to add the sliders to.
 */
export function addFieldsTo(app)
{
    // Find the ‘scale’ slider, since we’ll be adding the offset fields underneath that:
    const scaleField = app.element.find('[name=scale]').closest('.form-group')
    if (scaleField.length == 0)
        return log.error('‘scale’ field could not be found')

    // Get the current value of the offset fields:
    const offset = { x: 0.5, y: 0.5, ...getOffset(app.token) }

    // Add the offset fields:
    scaleField.after(`
        <div class='form-group'>
            <label>X Offset <span class='units'>(Ratio)</span></label>
            <div class='form-fields'>
                <input type='range' name='flags.andaels-tweaks.offset.x' value='${offset.x}' min='0' max='1' step='0.01' data-dtype='Number'>
                <span class='range-value'>${offset.x}</span>
            </div>
        </div>
        <div class='form-group'>
            <label>Y Offset <span class='units'>(Ratio)</span></label>
            <div class='form-fields'>
                <input type='range' name='flags.andaels-tweaks.offset.y' value='${offset.y}' min='0' max='1' step='0.01' data-dtype='Number'>
                <span class='range-value'>${offset.y}</span>
            </div>
        </div>`)

    // Update the header (if there is one):
    scaleField.closest('fieldset').find('legend').text(function(_, str)
    {
        return str == 'Size' ? 'Size / Offset' : ''
    })

    // Resize the dialog:
    app.setPosition()
}

/**
 * Updates a token’s sprite so that the token’s offset is applied.
 * @param {Token} token Which token to update.
 */
export function refreshPivot(token)
{
    const offset = getOffset(token.document)
    if (offset)
    {
        const sprite = token.mesh
        const { width, height } = sprite.texture
        const { scaleX, scaleY } = token.document.texture

        sprite.pivot.set(
            width * (0.5 - (offset.x ?? 0.5)) / scaleX,
            height * (0.5 - (offset.y ?? 0.5)) / scaleY
        )
    }
}

/**
 * Helper function for retrieving a token’s offset.
 * @param {TokenDocument} token
 */
function getOffset(token)
{
    return token.flags['andaels-tweaks']?.offset
}
