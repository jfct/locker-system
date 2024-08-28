import { mongoMigrateCli } from 'mongo-migrate-ts';
import { config } from './config';

mongoMigrateCli({
    uri: config.mongodb.uri || '',
    database: '',
    migrationsDir: 'src/migrations',
    migrationsCollection: 'changeCollections',
    options: {},
});