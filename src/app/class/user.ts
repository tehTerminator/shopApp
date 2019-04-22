export class User {
    private password?: string;
    id: number;
    name: string;
    authLevel: number;

    constructor(theId: number = 0, theName: string = 'Anonymous', theAuthLevel: number = -1) {
        this.id = theId;
        this.name = theName;
        this.authLevel = theAuthLevel;
        this.password = '';
    }

    isAuthorised(requestLevel: number): boolean {
        return this.authLevel >= requestLevel;
    }
}
