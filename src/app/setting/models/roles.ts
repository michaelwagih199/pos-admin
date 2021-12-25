import { PermissionModel } from './permission';

export interface RolesModel {
    id: number
    name: string
    createdDate: string
    permissions: PermissionModel[]
  }