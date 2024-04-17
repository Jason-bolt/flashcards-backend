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
const db = pgp(envs.DATABASE_URL);

export default db;
