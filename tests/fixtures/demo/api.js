import A from './a';
import B from './b';

export default {
  'GET /root/api/1.0/role/query': {
    id: 'root-get',
  },
  'POST /root/api/1.0/role/query': {
    id: 'root-post',
  },
  ...A,
  ...B,
};
