import { IPosition } from '@/views'
import ApiBase from './base'

export default class extends ApiBase {
    constructor() {
        super({})
    }
    schedule(id: number) {
        return this.http.get<IPosition[]>(`/position/schedule/${id}`)
    }
    itinerary(id: number) {
        return this.http.get<IPosition[]>(`/position/itinerary/${id}`)
    }
}
