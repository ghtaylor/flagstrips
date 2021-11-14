import { createConnection } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

const { PG_HOST, PG_PORT, PG_USER, PG_PASS, PG_DB } = process.env;

if (!(PG_HOST && PG_PORT && PG_USER && PG_PASS && PG_DB)) {
    console.error("Exiting app due to missing PG_HOST, PG_PORT, PG_USER, PG_PASS and PG_DB environment variables.");
    process.exit(1);
}

export default async function createDBConnection(): Promise<void> {
    await createConnection({
        type: "postgres",
        host: PG_HOST,
        port: Number(PG_PORT),
        database: PG_DB,
        username: PG_USER,
        password: PG_PASS,
        synchronize: false,
        logging: true,
        entities: ["**/entities/**/*.ts"],
        namingStrategy: new SnakeNamingStrategy(),
    });
}
