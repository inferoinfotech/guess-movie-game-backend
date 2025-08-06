export function generateRoomCode(length = 5): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < length; i++) {
        code += chars[Math.floor(Math.random() * chars.length)]
    }
    return code
}
