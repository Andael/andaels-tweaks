/**
 * @file Improved Quest Log
 * TODO
 */

import log from '../utils/log.js'

// Adds a shortcut (defaults to 'Q') for showing the Quest Log.
export function registerControls()
{
    log.assert(game.keybindings)

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
