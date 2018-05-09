import http from "./core/http";
import { AxiosResponse } from "axios";
import File from '../models/File';
import { PermissionTypes } from "../models/enumerations/PermissionTypes";
import { FileShareModel } from "../models/FileShareModel";

class SharingService {
    
    async getSharingLink(file: File, permission: PermissionTypes): Promise<string> {
        const path = await http.get<string>(`files/${file.id}/shareLink?p=${permission}`);
        return `${location.origin}/share/${path.data}/${permission}`;
    }

    async getAccess(fileId: string, permission: PermissionTypes) {
        await http.get(`files/${fileId}/share?p=${permission}`);
    }
    
    async saveShareOptions(model: FileShareModel) {
        await http.post(`files/sharing`, model);
    }
}

export default new SharingService()