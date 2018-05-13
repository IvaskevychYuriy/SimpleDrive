import http from "./core/http";
import { AxiosResponse } from "axios";
import File from '../models/File';
import { GridTypes } from "../models/enumerations/GridTypes";

class FileService {
    
    async listFiles(gridType: GridTypes): Promise<File[]> {
        const url = this.getUrlByType(gridType);
        const response = await http.get<File[]>(url);
        return response.data.map(x => new File(x));
    }

    async upload(files: FileList, progress: (percentCompleted: number) => void) {
        const formData = new FormData();

        for (let i = 0; i < files.length; ++i) {
            const file = files[i];
            formData.append('files', file, file.name);
        }

        await http.post('files', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent: ProgressEvent) => {
                const percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
                progress(percentCompleted);
            }
        });
    }

    async delete(fileId: number) {
        await http.delete(`files/${fileId}`);
    }

    private getUrlByType(gridType: GridTypes): string {
        switch (gridType) {
            case GridTypes.Personal: return 'files/personal';
            case GridTypes.Shared: return 'files/shared';
            case GridTypes.All: return 'files/all';
            default: return 'files/public';
        }
    }
}

export default new FileService();
