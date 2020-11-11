export class User {
    public id: number;
    public pwd:string;
    public email:string;
    public fullName: string;
 
    constructor (id:number,pwd:string,email:string, fullName:string) {
      this.id = id;
      this.pwd = pwd;
      this.email = email;
      this.fullName = fullName;
    }
}