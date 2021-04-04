import { ajax } from './fetch.ts'
import parser from './parser.ts'
export default class index extends parser {
    constructor(vid: string) {
        super(vid, ajax)
    }
}
