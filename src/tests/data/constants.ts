import { User, UserRole } from "../../entities/user.entity";

export const standardUser: User = {
  id: 1,
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@gmail.com",
  role: UserRole.Standard,
  token: "standard-secret-token",
};
