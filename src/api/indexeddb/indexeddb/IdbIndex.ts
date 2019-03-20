export default class IdbIndex {
    protected index: IDBIndex
    protected store: IDBObjectStore
    constructor(index: IDBIndex, store: IDBObjectStore) {
        this.index = index
        this.store = store
    }
    get<T>(value: string | number) {
        return new Promise<T>((resolve, reject) => {
            const request = this.index.get(value)
            request.onsuccess = () => resolve(request.result)
            request.onerror = (e) => reject(e)
        })
    }
    filter<T>(range: IDBKeyRange) {
        return new Promise<T[]>((resolve, reject) => {
            const request = this.index.openCursor(range)
            const result: T[] = []
            request.onsuccess = (e: any) => {
                const cursor = e.target.result
                if (cursor) {
                    result.push(cursor.value)
                    cursor.continue()
                } else {
                    resolve(result)
                }
            }
            request.onerror = (e) => reject(e)
        })
    }
    async delete(range: IDBKeyRange) {
        /* safari 不能通过index.openCursor去删除对象
            否则会在cursor.continue时返回null cursor
            导致cursor遍历中断
            所以此处先是获取了要删除的所有对象
            然后遍历执行单个记录的删除
         */

        return new Promise((resolve, reject) => {
            /* 最后定稿方案 */
            const request = this.index.openKeyCursor(range)
            const lists: any[] = []
            request.onsuccess = () => {
                const cursor = request.result
                if (cursor) {
                    lists.push(cursor.primaryKey)
                    cursor.continue()
                } else {
                    const promiseLists = lists.map((key) => {
                        return new Promise((deleteResolve, deleteReject) => {
                            const deleteRequest = this.store.delete(key)
                            deleteRequest.onsuccess = () => deleteResolve()
                            deleteRequest.onerror = (e) => deleteReject(e)
                        })
                    })
                    Promise.all(promiseLists)
                        .then(() => resolve())
                        .catch((e) => reject(e))
                }
            }
            request.onerror = (e) => reject(e)

            /* 兼容safari的方案 但主键不一定是id所以放弃该方案 */
            // this.filter<any>(range).then((lists) => {
            //     const all = lists.map((item) => {
            //         return new Promise((zresolve, zreject) => {
            //             const request = this.store.delete(item.id)
            //             request.onsuccess = () => zresolve()
            //             request.onerror = (e) => zreject(e)
            //         })
            //     })
            //     Promise.all(all)
            //         .then(() => resolve())
            //         .catch((err) => reject(err))
            // })

            /* 最初的方案 */
            // request.onsuccess = (e: any) => {
            //     const cursor = e.target.result
            //     if (cursor) {
            //         const deleteRequest = cursor.delete()
            //         deleteRequest.onsuccess = () => cursor.continue()
            //         deleteRequest.onerror = (err: any) => reject(err)
            //     } else {
            //         resolve()
            //     }
            // }
            // request.onerror = (e) => reject(e)
        })
    }
    count(value: IDBKeyRange) {
        return new Promise<number>((resolve, reject) => {
            const request = this.index.count(value)
            request.onsuccess = (e: any) => resolve(e.target.result)
            request.onerror = (e) => reject(e)
        })
    }
    first<T>(
        range: IDBKeyRange,
        direction?: 'next' | 'nextunique' | 'prev' | 'prevunique'
    ) {
        return new Promise<T | void>((resolve, reject) => {
            const request = this.index.openCursor(range, direction)
            request.onsuccess = (e: any) => {
                const cursor = e.target.result
                resolve(cursor ? cursor.value : void 0)
            }
            request.onerror = (e) => reject(e)
        })
    }
}
