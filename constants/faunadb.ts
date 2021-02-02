import * as faunadb from 'faunadb';
import { KEYS } from '../constants/keys';

export const faunadbClient = new faunadb.Client({ keepAlive: false, secret: KEYS.FAUNDADB_KEY, timeout: 15 })

export const faunadbQuery = faunadb.query;
