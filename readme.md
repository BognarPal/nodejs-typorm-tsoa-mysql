# TypeORM CLI
Official doc: [https://orkhan.gitbook.io/typeorm/docs/using-cli](https://orkhan.gitbook.io/typeorm/docs/using-cli)

Telepítéshez
```
npm install -g ts-node
```
Adatbázis és user létrehozása:
```mysql
CREATE DATABASE `typeorm-teszt`
	CHARACTER SET utf8
	COLLATE utf8_hungarian_ci;

use `typeorm-teszt`;

CREATE USER 'user'@'%' IDENTIFIED BY 'Passw0rd';
CREATE USER 'user'@'localhost' IDENTIFIED BY 'Passw0rd';

GRANT CREATE, ALTER, DROP, INSERT, UPDATE, DELETE, SELECT, REFERENCES, RELOAD on *.* TO 'user'@'localhost' WITH GRANT OPTION;
GRANT CREATE, ALTER, DROP, INSERT, UPDATE, DELETE, SELECT, REFERENCES, RELOAD on *.* TO 'user'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```
Migráció generálása
```
npm run typeorm -- migration:generate -n init
```
Migráció futtatása:
```
npm run typeorm -- migration:run
```

tsoa route-ok létrehozása
```
npm run tsoa routes
```

tsoa route-ok és swagger.json létrehozása
```
npm run tsoa spec-and-routes
```

