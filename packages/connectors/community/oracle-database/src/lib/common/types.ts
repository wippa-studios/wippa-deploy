import { StaticPropsValue } from '@wippa/connectors-framework';
import { oracleDbAuth } from '../common/auth';

export type OracleDbAuth = StaticPropsValue<(typeof oracleDbAuth)['props']>;
