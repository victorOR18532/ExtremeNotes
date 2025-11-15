import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '15s', target: 20 },
    { duration: '15s', target: 40 },
    { duration: '15s', target: 70 },
    { duration: '30s', target: 100 },
    { duration: '10s', target: 0 },
  ],
};

export default function () {
  const res = http.get('http://localhost:4000/notes');

  check(res, {
    'status 200': (r) => r.status === 200,
  });

  sleep(1);
}
