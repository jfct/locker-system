import { mongoMigrateCli } from 'mongo-migrate-ts';
import { config } from './config';

console.log('config uri', config.mongodb.uri);

mongoMigrateCli({
    uri: config.mongodb.uri || '',
    database: '',
    migrationsDir: 'src/migrations',
    migrationsCollection: 'changeCollections',
    options: {},
});