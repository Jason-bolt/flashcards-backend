import promise from 'bluebird';
import pg from 'pg-promise';
import monitor from 'pg-monitor';
import envs from '../env';

const options = {
  promiseLib: promise,
};

monitor.setTheme('invertedMonochrome');
monitor.attach(options);

const pgp = pg(options);

const DATABASE_URL = envs.NODE_ENV === 'development' ? envs.DATABASE_URL : envs.STAGING_DATABASE_URL
const db = pgp(DATABASE_URL);

export default db;
