import {MigrationInterface, QueryRunner} from "typeorm";
import { authInserts } from "./auth.inserts";

export class init1642405926021 implements MigrationInterface {
    name = 'init1642405926021'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(30) NOT NULL, UNIQUE INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(200) NOT NULL, \`name\` varchar(100) NOT NULL, \`passwordHash\` varchar(200) NOT NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`sessions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`lastAccess\` datetime NOT NULL, \`token\` varchar(200) NOT NULL, \`userId\` int NULL, UNIQUE INDEX \`IDX_e9f62f5dcb8a54b84234c9e7a0\` (\`token\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users_roles\` (\`usersId\` int NOT NULL, \`rolesId\` int NOT NULL, INDEX \`IDX_deeb1fe94ce2d111a6695a2880\` (\`usersId\`), INDEX \`IDX_21db462422f1f97519a29041da\` (\`rolesId\`), PRIMARY KEY (\`usersId\`, \`rolesId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`sessions\` ADD CONSTRAINT \`FK_57de40bc620f456c7311aa3a1e6\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users_roles\` ADD CONSTRAINT \`FK_deeb1fe94ce2d111a6695a2880e\` FOREIGN KEY (\`usersId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`users_roles\` ADD CONSTRAINT \`FK_21db462422f1f97519a29041da0\` FOREIGN KEY (\`rolesId\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        for (const sql of authInserts) {
            await queryRunner.query(sql);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users_roles\` DROP FOREIGN KEY \`FK_21db462422f1f97519a29041da0\``);
        await queryRunner.query(`ALTER TABLE \`users_roles\` DROP FOREIGN KEY \`FK_deeb1fe94ce2d111a6695a2880e\``);
        await queryRunner.query(`ALTER TABLE \`sessions\` DROP FOREIGN KEY \`FK_57de40bc620f456c7311aa3a1e6\``);
        await queryRunner.query(`DROP INDEX \`IDX_21db462422f1f97519a29041da\` ON \`users_roles\``);
        await queryRunner.query(`DROP INDEX \`IDX_deeb1fe94ce2d111a6695a2880\` ON \`users_roles\``);
        await queryRunner.query(`DROP TABLE \`users_roles\``);
        await queryRunner.query(`DROP INDEX \`IDX_e9f62f5dcb8a54b84234c9e7a0\` ON \`sessions\``);
        await queryRunner.query(`DROP TABLE \`sessions\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` ON \`roles\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
    }

}
