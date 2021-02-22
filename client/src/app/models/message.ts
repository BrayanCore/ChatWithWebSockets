export class Message {
    // id user who sends message
    id:   string =  '';
    // name user who sends message
    user: string =  '';
    // content
    text: string =  '';

    public constructor(init?: Partial<Message>) {
        Object.assign(this, init);
    }
}