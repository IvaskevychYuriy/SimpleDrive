import { PermissionTypes } from "./enumerations/PermissionTypes";

export interface ResourcePermission {
    id: number;
    permissionId: PermissionTypes;
    userId: number;
    fileId: number;
}