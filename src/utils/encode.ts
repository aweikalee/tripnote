export function htmlEncode(text: string): string {
    if (text.length === 0) {
        return ''
    }
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/ /g, '&nbsp;')
        .replace(/\'/g, '&apos;')
        .replace(/\"/g, '&quot;')
}

export function breakEncode(text: string): string {
    if (text.length === 0) {
        return ''
    }
    return text.replace(/\r\n|\r|\n/g, '<br>')
}
