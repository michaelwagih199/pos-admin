import { RolesModel } from './roles'

export class UserModel {
    id!: number
    username!: string
    email!: string
    password!: string
    createdDate!: string
    roles!: RolesModel[]
  }

