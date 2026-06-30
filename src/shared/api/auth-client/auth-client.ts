import axios from 'axios';

import { getRuntimeString } from '@/utils';

export const authClient = axios.create({
  baseURL: getRuntimeString('authBaseUrl'),
});
