import React, { useEffect, useState } from 'react';
const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function App(){
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sport, setSport] = useState('');

  useEffect(()=> {
    fetch(`${API}/notes`).then(r=>r.json()).then(setNotes).catch(()=>setNotes([]));
  }, []);

  const create = async () => {
    if(!title) return alert('Título requerido');
    const res = await fetch(`${API}/notes`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ title, content, sport })
    });
    const n = await res.json();
    setNotes([n, ...notes]);
    setTitle(''); setContent(''); setSport('');
  };

  const remove = async (id) => {
    await fetch(`${API}/notes/${id}`, { method:'DELETE' });
    setNotes(notes.filter(n=>n._id !== id));
  };

  return (
    <div className="container">
      <h1>ExtremeNotes</h1>
      <div className="form">
        <input placeholder="Título" value={title} onChange={e=>setTitle(e.target.value)} />
        <input placeholder="Deporte (ej: surf, parapente)" value={sport} onChange={e=>setSport(e.target.value)} />
        <textarea placeholder="Contenido" value={content} onChange={e=>setContent(e.target.value)} />
        <button onClick={create}>Crear nota</button>
      </div>
      <hr/>
      <ul className="notes">
        {notes.map(n=>(
          <li key={n._id}>
            <div className="note-header">
              <strong>{n.title}</strong> <span className="sport">{n.sport}</span>
            </div>
            <p>{n.content}</p>
            <button onClick={()=>remove(n._id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
