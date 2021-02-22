export class User {
    id:   string =  '';
    name: string =  '';

    public constructor(init?: Partial<User>) {
        Object.assign(this, init);
    }
}