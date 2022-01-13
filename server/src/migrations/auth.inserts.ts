export const authInserts = [
    "Insert into roles (name) values ('admin'), ('user')",
    "Insert into users (email, name, passwordhash) values ('admin@droptable.jedlik.local', 'admin', 'abc')",
]

/*
Bemásolni az Auth migrációs lépésbe

        for (const sql of authInserts) {
            await queryRunner.query(sql);
        }
*/        