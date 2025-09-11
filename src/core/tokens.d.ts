interface Token
{
    id: string
    document: TokenDocument
    center: Point
    _removeDragWaypoint(): void
    _triggerDragLeftCancel(): void
}

interface TokenDocument
{
    rotation: number
}

declare namespace canvas.tokens
{
    const controlled: Token[]
}

type TokenDocumentUpdate = { _id: string } & Partial<TokenDocument>

interface Scene
{
    updateEmbeddedDocuments(type: "Token", updates: TokenDocumentUpdate[]): Promise<void>
}

interface StaticHooks
{
    targetToken(user: User, target: Token, wasTargetAdded: boolean): void
}
