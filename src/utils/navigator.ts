export function isMobile() {
    if (
        /AppleWebKit.*Mobile/i.test(navigator.userAgent) ||
        // tslint:disable-next-line
        /MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(
            navigator.userAgent
        )
    ) {
        return true
    }
    return false
}

export function systemOS() {
    const u = navigator.userAgent
    if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) {
        return 'android'
    } else if (
        !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) ||
        /(iPhone|iPad|iPod|iOS)/i.test(u)
    ) {
        return 'ios'
    } else {
        return ''
    }
}
