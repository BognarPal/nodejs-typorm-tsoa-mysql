import { UserRepository } from "../repositories/user.repository"

export const authInserts = [
    "Insert into roles (name) values ('admin'), ('user')",
    "Insert into users (email, name, passwordhash) values ('admin@droptable.jedlik.local', 'admin', '$2b$10$qtfvudW77Gga5FOyTdrCYucUcB9QpUOry2tL.xgIq0eQbkdQ5G3UC')",
    "Insert into users_roles(usersId, rolesId) values (1, 1)"
]

/*
Bemásolni az Auth migrációs lépésbe

        for (const sql of authInserts) {
            await queryRunner.query(sql);
        }
*/        