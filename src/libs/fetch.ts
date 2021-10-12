

const headers = new Headers({
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:74.0) Gecko/20100101 Firefox/74.0',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
})

const cache = new Map()

const get = (key: string) => {
    const item = cache.get(key)
    if (item) {
        if (item.expire > +new Date()) {
            return item.value
        } else {
            expire()
        }
    }
}

const set = (key: string, value: unknown, ttl = 3600e3) => {
    cache.set(key, { value, expire: +new Date() + ttl })
}

const expire = () => {
    const t = +new Date()
    for (const [k, v] of cache) {
        if (v.expire < t) {
            cache.delete(k)
        }
    }
}

export const ajax = async (url: string): Promise<string> => {
    let text = get(url)
    if (text) {
        return text
    }
    const init = {
        headers,
        method: 'GET',
    } as RequestInit
    const r = await fetch(url, init)
    text = await r.text()
    set(url, text)
    return text
}

export const doPost = async (url: string, body: string, cacheKey: string): Promise<string> => {
    let text = get(cacheKey)
    if (text) {
        return text
    }
    const init = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:74.0) Gecko/20100101 Firefox/74.0',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: body,
    } as RequestInit
    const r = await fetch(url, init)
    text = await r.text()
    set(cacheKey, text)
    return text
}