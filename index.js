// Polling here because overriding the push method on window.dataLayer caused issuese in GTM preview mode
class DB {
    constructor() {
        this._dbName = "_verifier_db";
        // this._db = chrome.storage.local.get([this._dbName]);
        if (!window.localStorage.getItem(this._dbName)) {
            // 2 = unseen
            // 1 = valid
            // 0 = invalid
            const dlEventMap = {
                dl_add_to_cart: 2,
                dl_begin_checkout: 2,
                dl_login: 2,
                dl_remove_from_cart: 2,
                dl_search_results: 2,
                dl_select_item: 2,
                dl_sign_up: 2,
                dl_user_data: 2,
                dl_view_cart: 2,
                dl_view_item_list: 2,
                dl_view_item: 2,
            };
            window.localStorage.setItem(
                this._dbName,
                JSON.stringify(dlEventMap)
            );
        }
    }

    getDB() {
        return JSON.parse(window.localStorage.getItem(this._dbName));
    }

    setProperty(obj) {
        window.localStorage.setItem(
            this._dbName,
            JSON.stringify(Object.assign(this.getDB(), obj))
        );
    }

    clear() {
        chrome.storage.local.clear();
    }
}
let db = new DB();
let lastIndexProcessed = 0;
window.dataLayer = window.dataLayer || [];
setInterval(function () {
    for (; lastIndexProcessed < window.dataLayer.length; lastIndexProcessed++) {
        const dlEvent = evaluateDLEvent(window.dataLayer[lastIndexProcessed]);
        if (!dlEvent) continue;
        db.setProperty({[dlEvent.getEventName()]: dlEvent.isValid() ? 1 : 0})
    }
}, 1000);
