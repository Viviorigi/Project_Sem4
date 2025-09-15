export class FeedSearch{
    keySearch: string
    page: number
    book_id: number
    timer: number

    constructor(keySearch: string, page: number, book_id: number, timer: number){
        this.keySearch = keySearch;
        this.page = page;
        this.book_id = book_id;
        this.timer = timer;
    }
}