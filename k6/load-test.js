import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 15,
  duration: '30s'
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
  check(res, { 'status es 201': (r) => r.status === 201 });
  sleep(0.2);
}
