export interface UserDTO {
  _id: string;
  username: string;
  password?: string;
  email: string;
  save: () => Promise<void>;
}
