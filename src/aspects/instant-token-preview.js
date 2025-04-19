/**
 * @file Instant Token Preview
 * Foundry V10 lets you preview any changes you make to a token’s configuration. However, the
 * preview only updates on blur (for text fields) or when you let go (for sliders). This feature
 * makes it so that the preview updates immediately.
 */

/**
 * Enables instant token preview for a TokenConfig dialog.
 * @param {TokenConfig} app Which dialog to enable it for.
 */
export function enableFor(app)
{
    app.element.off('input', onFormInput)
    app.element.on('input', onFormInput)
}

/**
 * Called when the [input](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)
 * event is triggered inside a TokenConfig dialog.
 * @param {JQuery.TriggeredEvent} evt
 */
function onFormInput(evt)
{
    const input = evt.target

    // Ignore select/textarea fields:
    if (!(input instanceof HTMLInputElement))
        return

    // Color pickers are custom elements so need special handling:
    if (input.parentElement instanceof foundry.applications.elements.HTMLColorPickerElement)
    {
        // Ignore incomplete text (let the user finish typing):
        if (!foundry.data.validators.isColorString(input.value))
            return

        // Update the color picker itself:
        input.parentElement.value = input.value
        return
    }

    // Trick Foundry into updating the preview:
    $(input).trigger('change')
}
