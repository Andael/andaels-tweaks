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
    // Find the textboxes for X and Y anchor:
    const xAnchor = app.element.find('[name="texture.anchorX"]')
    if (xAnchor.length != 1 || !(xAnchor[0] instanceof HTMLInputElement))
        return log.error('X Anchor field not found')
    const yAnchor = app.element.find('[name="texture.anchorY"]')
    if (yAnchor.length != 1 || !(yAnchor[0] instanceof HTMLInputElement))
        return log.error('Y Anchor field not found')

    // Find the form group containing those fields:
    const anchorGroup = xAnchor.closest('.form-group')
    if (anchorGroup[0] != yAnchor.closest('.form-group')[0])
        return log.error('X and Y Anchor were not in the same form group')

    // Update the section header if there is one (e.g. in the PF2e system):
    anchorGroup.closest('fieldset').find('legend').text(function(_, str)
    {
        return str == 'Size' ? 'Size / Anchor' : ''
    })

    // Read initial values from the initially-rendered HTML. This method is better than using
    // `app.token` as it supports re-renders (e.g. when toggling size lock in the PF2e system).
    const texture = {
        anchorX: xAnchor[0].valueAsNumber,
        anchorY: yAnchor[0].valueAsNumber,
    }

    // Replace the textboxes with sliders:
    anchorGroup.replaceWith(`
        <div class='form-group'>
            <label>X Anchor <span class='units'>(Ratio)</span></label>
            <div class='form-fields'>
                <input type='range' style='direction: rtl' name='texture.anchorX' value='${texture.anchorX}' min='0' max='1' step='0.01' data-dtype='Number'>
                <span class='range-value'>${texture.anchorX}</span>
            </div>
        </div>
        <div class='form-group'>
            <label>Y Anchor <span class='units'>(Ratio)</span></label>
            <div class='form-fields'>
                <input type='range' style='direction: rtl' name='texture.anchorY' value='${texture.anchorY}' min='0' max='1' step='0.01' data-dtype='Number'>
                <span class='range-value'>${texture.anchorY}</span>
            </div>
        </div>`)

    // Resize the dialog:
    app.setPosition()
}
