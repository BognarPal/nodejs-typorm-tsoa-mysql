import { RoleModel } from "./role.model.";

export class LoginResponseModel {
    email: string;
    name: string;
    roles: RoleModel[];
    token: string;

    public constructor(init?:Partial<LoginResponseModel>) {
        if (init)
            Object.assign(this, init);
    }

}