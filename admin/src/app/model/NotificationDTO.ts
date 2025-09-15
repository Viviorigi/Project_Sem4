export class NotificationDTO {
    not_id?: number;
    message: string;
    receiver?: string;
    isRead?: string;
    cre_dt?: string;

    constructor (message:string){
        this.message = message;
    }
}