export default class File {
    constructor (raw: Partial<File>) {
        Object.assign(this, raw);
        this.createdTimestamp = new Date(raw.createdTimestamp);
        this.updatedTimestamp = new Date(raw.updatedTimestamp);
    }

    id: number;
    name: string;
    path: string;
    contentType: string;
    createdTimestamp: Date;
    updatedTimestamp: Date;
    ownerId: number;
} 
