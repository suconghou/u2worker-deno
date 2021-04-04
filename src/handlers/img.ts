import { applyRequest } from '../utils/util.ts'


const imageMap = {
    "jpg": "http://i.ytimg.com/vi/",
    "webp": "http://i.ytimg.com/vi_webp/"
} as any

export default async (event: any) => {
    const matches = event.request.url.match(/\/video\/([\w\-]{6,12})\.(jpg|webp)/)
    const vid = matches[1]
    const ext = matches[2]
    const target = imageMap[ext] + vid + "/mqdefault." + ext
    const headers = {
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36'
    };
    const init = {
        method: 'GET',
        headers,
    }
    return applyRequest(event, target, init)
}