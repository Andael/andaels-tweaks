/**
 * @file Functions that write to the console. Console output will be prefaced
 * with this module’s name.
 */

const PREFACE = ['%cAndael’s Tweaks%c %s', 'font: bold 1.1em sans-serif', '']

/**
 * Writes information to the console.
 * @param  {...unknown} output The message or data to write to the console.
 * @returns {void}
 */
function log(...output)
{
    console.log(...PREFACE, ...output)
}

/**
 * Writes an error to the console and displays a toast message indicating that an error occurred.
 * @param  {...unknown} output The message or data to write to the console.
 * @returns {void}
 */
log.error = function(...output)
{
    console.error(...PREFACE, ...output)
    ui.notifications.warn('Andael’s Tweaks encountered an error. Check the JS console for details.', { console: false })
}

export default log
