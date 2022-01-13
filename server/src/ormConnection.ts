import { Connection, ConnectionOptions, createConnection } from 'typeorm';
 

export async function createOrmConnection(): Promise<Connection> {
    var connection = createConnection({
        type: 'mysql',
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        entities: [
          __dirname + '/models/**/*.ts',
        ],
        migrations: [ 
          __dirname + '/migrations/**/*.ts',
        ]
    });
    
    await (await connection).runMigrations({
      transaction: 'all'      
     });

    return connection;
}

