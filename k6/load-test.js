import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 15,
  duration: '30s',
};

export default function () {
  const url = 'http://localhost:4000/notes';
  const payload = JSON.stringify({
    title: `Nota k6 ${Math.random().toString(36).slice(2,8)}`,
    content: 'Prueba de carga',
    sport: 'parapente'
  });

  const params = { headers: { 'Content-Type': 'application/json' } };
  const res = http.post(url, payload, params);

  check(res, {
    'status 201': (r) => r.status === 201,
    'tiempo < 400ms': (r) => r.timings.duration < 400,
  });

  sleep(0.2);
}
