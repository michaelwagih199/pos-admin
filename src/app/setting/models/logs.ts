
export interface LogsModel {
    id: number
    description: string
    createdDate: string
    user: User
    userLogsType: UserLogsType
  }
  
  export interface User {
    id: number
    username: string
    email: string
    password: string
    createdDate: string
    roles: Role[]
  }
  
  export interface Role {
    id: number
    name: string
    createdDate: string
    permissions: Permission[]
  }
  
  export interface Permission {
    id: number
    permissionName: string
  }
  
  
  export interface UserLogsType {
    id: number
    typeName: string
  }
  
