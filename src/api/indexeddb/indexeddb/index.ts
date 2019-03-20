import IdbStore from './IdbStore'

export interface IIDBOptions {
    name: string
}
export interface IUpgradeDB {
    version: number
    handler: (
        db: IDBDatabase,
        request: IDBOpenDBRequest,
        event: IDBVersionChangeEvent
    ) => void
}

export default class IndexedDB {
    name: string
    version: number = 0
    upgradeDBLists: IUpgradeDB[] = []
    constructor({ name }: IIDBOptions) {
        this.name = name
    }

    /* 构建数据库 */
    upgradeDB(version: IUpgradeDB['version'], handler: IUpgradeDB['handler']) {
        this.upgradeDBLists.push({
            version,
            handler
        })
        this.version = version
    }

    /* 打开数据库 */
    open(): Promise<IDBDatabase> {
        /* 原先是讲打开好db存在this.db里 以便后面取用
        但safari里不使用的db会自动关闭，基本上每次使用都需要open一次 */
        const request = indexedDB.open(this.name, this.version)

        request.onupgradeneeded = (e: IDBVersionChangeEvent) => {
            /* 数据库版本更新 */
            const oldVersion = e.oldVersion
            this.upgradeDBLists.forEach((item) => {
                if (oldVersion < item.version) {
                    item.handler(request.result, request, e)
                }
            })
        }

        return new Promise((resolve, reject) => {
            request.onsuccess = (e: any) => resolve(e.target.result)
            request.onerror = (e) => reject(e)
        })
    }
    async store(storeName: string, mode: IDBTransactionMode = 'readonly') {
        const db = await this.open()
        const store = db.transaction(storeName, mode).objectStore(storeName)
        return new IdbStore(store)
    }
}
