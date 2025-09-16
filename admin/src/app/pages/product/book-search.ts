export class BookSearch{
    keySearch: string
    page: number
    cate_id: number
    timer: number

    constructor(keySearch: string, page: number, cate_id: number, timer: number){
        this.keySearch = keySearch;
        this.page = page;
        this.cate_id = cate_id;
        this.timer = timer;
    }
}