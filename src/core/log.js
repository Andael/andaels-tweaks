const MODULE_DISPLAY_NAME = "Andael’s Tweaks"
const LOG_PREFACE = ["%c%s%c %s", "font: bold 1.1em sans-serif", MODULE_DISPLAY_NAME, ""]

/**
 * Writes information to the console.
 * @param  {...any} output The message or data to write to the console.
 * @returns {void}
 */
function log(...output)
{
    console.log(...LOG_PREFACE, ...output)
}

/**
 * Writes an error to the console and displays a toast message indicating that an error occurred.
 * @param  {...any} output The message or data to write to the console.
 * @returns {void}
 */
log.error = function(...output)
{
    console.error(...LOG_PREFACE, ...output)
    ui.notifications.warn(`${MODULE_DISPLAY_NAME} encountered an error. Check the JS console for details.`, { console: false })
}

export default log
