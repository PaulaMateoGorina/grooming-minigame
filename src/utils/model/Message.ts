class Message {
    public id:number;
    public sender:string;
    public text:string;

    constructor(id:number, sender: string, text: string) {
        this.id = id;
        this.sender = sender;
        this.text = text;
    }
}

export default Message;