import { MODULE_ID } from "../core/meta.js"

/**
 * @returns {void}
 */
function applyFix()
{
    libWrapper.register(MODULE_ID, "foundry.CONFIG.Token.objectClass.prototype.distanceTo", distanceTo, "OVERRIDE")
}

/**
 * @this {Token}
 * @param {Token} target
 * @returns {number}
 */
function distanceTo(target)
{
    if (!canvas.ready)
        return NaN

    if (this == target)
        return 0

    // distance between base centers (measured in squares)
    const delta = {
        x: Math.abs(target.center.x - this.center.x) / canvas.grid.sizeX,
        y: Math.abs(target.center.y - this.center.y) / canvas.grid.sizeY,
    }

    // calculate distance from delta (still measured in squares)
    let distance = Math.sqrt(delta.x * delta.x + delta.y * delta.y)

    // compensate for base sizes
    distance = distance - (this.document.width + target.document.width) / 2 + 1

    // convert to grid units, e.g. feet
    distance *= canvas.grid.distance

    // take elevation into account (which is measured in units)
    const deltaZ = Math.abs(target.document.elevation - this.document.elevation)
    distance = Math.sqrt(distance * distance + deltaZ * deltaZ)

    // round down (to make things less fiddly)
    distance = Math.floor(distance)

    return distance
}

export const TokenDistanceCalulation = {
    applyFix: applyFix
}
