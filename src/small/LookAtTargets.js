/** @type {number} */
const RAD_TO_DEG = 360.0 / (Math.PI * 2.0)

/**
 * @returns {void}
 */
function registerHooks()
{
    Hooks.on("targetToken", function(_, target, wasTargetAdded)
    {
        if (!wasTargetAdded)
            return
        onTokenTargeted(target)
    })
}

/**
 * @returns {Token[]}
 */
function getControlledOrPrimaryTokens()
{
    const controlledTokens = canvas.tokens.controlled
    if (controlledTokens.length)
        return controlledTokens

    if (game.user.character)
        return game.user.character.getActiveTokens()

    return []
}

/**
 * @param {Point} from
 * @param {Point} to
 * @returns {number}
 */
function getAngleFromTo(from, to)
{
    let newAngle = Math.atan2(to.y - from.y, to.x - from.x) * RAD_TO_DEG
    newAngle = Math.normalizeDegrees(newAngle + 270)
    return newAngle
}

/**
 * @param {Token} target
 * @returns {void}
 */
function onTokenTargeted(target)
{
    const controlledTokens = getControlledOrPrimaryTokens()
    if (!controlledTokens.length)
        return

    const updates = controlledTokens.map(token =>
    {
        const newAngle = getAngleFromTo(token.center, target.center)

        if (token.document.rotation == newAngle)
            return null

        return {
            _id: token.id,
            rotation: newAngle,
        }
    }).filter(u => u != null)

    if (updates.length)
        canvas.scene.updateEmbeddedDocuments("Token", updates)
}

export const LookAtTargets =
{
    registerHooks
}
