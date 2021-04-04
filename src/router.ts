// Conditions
const Method = (method: string) => (req: Request) => req.method.toLowerCase() === method.toLowerCase()

// Helper functions that when passed a request
// will return a boolean for if that request uses that method, header, etc..
const Get = Method('get')
const Post = Method('post')
const Put = Method('put')
const Patch = Method('patch')
const Delete = Method('delete')
const Head = Method('head')
const Options = Method('options')

const Header = (header: string, val: string) => (req: Request) => req.headers.get(header) === val
const Host = (host: string) => Header('host', host.toLowerCase())
const Referrer = (host: string) => Header('referrer', host.toLowerCase())

const Path = (regExp: RegExp) => (req: Request) => {
    const url = new URL(req.url)
    const path = url.pathname
    return path.match(regExp)
}

// Router
class Router {
    private routes: Array<any> = [];
    constructor() {
        this.routes = []
    }

    handle(conditions: Array<any>, handler: Function) {
        this.routes.push({
            conditions,
            handler,
        })
        return this
    }

    get(url: RegExp, handler: Function) {
        return this.handle([Get, Path(url)], handler)
    }

    post(url: RegExp, handler: Function) {
        return this.handle([Post, Path(url)], handler)
    }

    patch(url: RegExp, handler: Function) {
        return this.handle([Patch, Path(url)], handler)
    }

    delete(url: RegExp, handler: Function) {
        return this.handle([Delete, Path(url)], handler)
    }

    all(handler: Function) {
        return this.handle([], handler)
    }

    route(event: any) {
        const route = this.resolve(event.request)

        if (route) {
            return route.handler(event)
        }

        return new Response('not found', {
            status: 404,
            statusText: 'not found',
            headers: {
                'content-type': 'text/plain',
            },
        })
    }

    // resolve returns the matching route, if any
    resolve(req: Request) {
        return this.routes.find(r => {
            if (!r.conditions || (Array.isArray(r.conditions) && !r.conditions.length)) {
                return true
            }

            if (typeof r.conditions === 'function') {
                return r.conditions(req)
            }

            return r.conditions.every((c: any) => c(req))
        })
    }
}

export default Router