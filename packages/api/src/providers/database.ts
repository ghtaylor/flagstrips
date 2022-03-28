import { Connection, createConnection, getConnection } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

const { PG_HOST, PG_PORT, PG_USER, PG_PASS, PG_DB } = process.env;

if (!(PG_HOST && PG_PORT && PG_USER && PG_PASS && PG_DB)) {
    console.error("Exiting app due to missing PG_HOST, PG_PORT, PG_USER, PG_PASS and PG_DB environment variables.");
    process.exit(1);
}

console.log(PG_DB);

export type ConnectionClearOptions = {
    persistedEntityNames?: string[];
};

const connection = {
    create: async (): Promise<Connection> =>
        createConnection({
            type: "postgres",
            host: PG_HOST,
            port: Number(PG_PORT),
            database: PG_DB,
            username: PG_USER,
            password: PG_PASS,
            synchronize: false,
            entities: ["**/entities/**/*.ts"],
            namingStrategy: new SnakeNamingStrategy(),
        }),
    close: async (): Promise<void> => getConnection().close(),
    clear: async (
        clearOptions: ConnectionClearOptions | undefined = {
            persistedEntityNames: ["UserRoleEntity", "StripImageOptionEntity", "AnimationPresetOptionEntity"],
        },
    ): Promise<void> => {
        const connection = getConnection();
        const entities = connection.entityMetadatas;

        entities
            .filter((entity) => !clearOptions.persistedEntityNames?.includes(entity.name))
            .forEach(async (entity) => {
                const repository = connection.getRepository(entity.name);
                await repository.query(`DELETE FROM ${entity.tableName}`);
            });
    },
};
export default connection;
