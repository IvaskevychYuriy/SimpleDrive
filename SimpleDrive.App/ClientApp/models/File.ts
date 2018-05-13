import { PermissionTypes } from "./enumerations/PermissionTypes";

export default class File {
    constructor (raw: Partial<File>) {
        Object.assign(this, raw);        
        this.createdTimestamp = new Date(raw.createdTimestamp);
        this.updatedTimestamp = new Date(raw.updatedTimestamp);

        this.uri = `api/files/${this.id}`;
    }

    id: number;
    uri: string;
    name: string;
    contentType: string;
    createdTimestamp: Date;
    updatedTimestamp: Date;
    ownerId: number;

    isOwner: boolean;
    isPubliclyVisible: boolean;
    permission: PermissionTypes;
} 
