
import Router from './router.ts'
import img from './handlers/img.ts'
import video, { videoInfo } from './handlers/video.ts'

async function handleRequest(event: any) {
    let response: Response;
    try {
        const r = new Router()
        r.get(/^\/video\/([\w\-]{6,12})\.(jpg|webp)$/, img)
        r.get(/^\/video\/([\w\-]{6,12})\.json$/, videoInfo)
        r.get(/^\/video\/([\w\-]{6,12})\/(\d{1,3})\/(\d+-\d+)\.ts$/, video)

        response = await r.route(event)

        if (!response) {
            response = new Response('Not Found', { status: 404 })
        }

        return response

    } catch (err) {
        response = new Response(err.stack || err, { status: 500 })
        return response
    }

}


addEventListener("fetch", (event: any) => {
    event.respondWith(handleRequest(event))
})
