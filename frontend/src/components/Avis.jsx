import React, { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

function Avis({ projectId = null }) {
  const [avis, setAvis] = useState([]);

  useEffect(() => {
    const fetchAvis = async () => {
      let q;
      if (projectId) {
        q = query(
          collection(db, "avis"),
          where("status", "==", "approved"),
          where("projectId", "==", projectId)
        );
      } else {
        q = query(
          collection(db, "avis"),
          where("status", "==", "approved"),
          where("projectId", "==", null)
        );
      }
      const querySnapshot = await getDocs(q);
      setAvis(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchAvis();
  }, [projectId]);

  const renderStars = (rating) => "★".repeat(rating) + "☆".repeat(5 - rating);

  if (avis.length === 0) return null;

  return (
    <section className="testimonials">
      <h1>Ce que disent nos clients</h1>
      <p>La satisfaction client au cœur de notre mission</p>
      <div className="testimonials-grid">
        {avis.map(a => (
          <div className="testimonial-card" key={a.id}>
            <h4>{a.clientName}</h4>
            {a.clientRole && <p>{a.clientRole}</p>}
            <p>{renderStars(a.rating)}</p>
            <p>"{a.message}"</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Avis;
