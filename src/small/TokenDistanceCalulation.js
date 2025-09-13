import { MODULE_ID } from "../core/meta.js"

/**
 * @returns {void}
 */
function applyFix()
{
    libWrapper.register(MODULE_ID, "foundry.CONFIG.Token.objectClass.prototype.distanceTo", distanceTo, "OVERRIDE")
}

/**
 * @this {unknown}
 * @param {Token} from
 * @param {{ center:Point, document: { width: number, elevation: number }}} to
 * @returns {number}
 */
function distanceBetween(from, to)
{
    if (!canvas.ready)
        return NaN

    if (from == to)
        return 0

    // distance between base centers (measured in squares)
    const delta = {
        x: Math.abs(to.center.x - from.center.x) / canvas.grid.sizeX,
        y: Math.abs(to.center.y - from.center.y) / canvas.grid.sizeY,
    }

    // calculate distance from delta (still measured in squares)
    let distance = Math.sqrt(delta.x * delta.x + delta.y * delta.y)

    // compensate for base sizes
    distance = distance - (from.document.width + to.document.width) / 2 + 1

    // convert to grid units, e.g. feet
    distance *= canvas.grid.distance

    // take elevation into account (which is measured in units)
    const deltaZ = Math.abs(to.document.elevation - from.document.elevation)
    distance = Math.sqrt(distance * distance + deltaZ * deltaZ)

    // round down (to make things less fiddly)
    distance = Math.floor(distance)

    return distance
}

/**
 * @this {Token}
 * @param {Token | Point} target
 * @returns {number}
 */
function distanceTo(target)
{
    if ("center" in target)
        return distanceBetween(this, target)
    else
        return distanceBetween(this, {
            center: target,
            document: {
                width: 1,
                elevation: this.document.elevation,
            },
        })
}

export const TokenDistanceCalulation = {
    applyFix: applyFix
}
