import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 25,
  duration: '20s',
};

export default function () {
  const res = http.get('http://localhost:4000/notes');

  check(res, {
    'status 200': (r) => r.status === 200,
    'duración < 300ms': (r) => r.timings.duration < 300,
  });

  sleep(0.1);
}
