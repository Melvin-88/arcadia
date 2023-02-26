export interface UserInterface {
   status: string;
   id: number;
   isAdmin: boolean;
   userName: string;
   firstName: string;
   lastName: string;
   lastAccessDate: Date;
   lastAccessIp: string;
   phone1: string;
   phone2: string;
   email: string;
   permittedModules: number[];
}
