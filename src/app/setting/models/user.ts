import { RolesModel } from './roles'

export interface UserModel {
    id: number
    username: string
    email: string
    password: string
    createdDate: string
    roles: RolesModel[]
  }

