export interface Login {
  username: string;
  password: string;
}
export interface LoginUser {
  accessToken: string;
  id: string;
  email: String;
  gender: number;
  nickName: string;
  username: string;
  isAdmin: number;
  expireTime: Date;
  loginTime: Date;
}
