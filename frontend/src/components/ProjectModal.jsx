import React, { useState, useEffect } from 'react';

const defaultProject = {
  titre: '',
  description: '',
  images: '',
  statut: 'En cours',
  typeServiceId: '',
  clientId: '',
  employeId: ''
};

function ProjectModal({ isOpen, onClose, onSave, services = [], clients = [], employes = [], project }) {
  const [form, setForm] = useState(defaultProject);

  useEffect(() => {
    if (project) setForm(project);
    else setForm(defaultProject);
  }, [project, isOpen]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave(form);
  };

  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal-content" onClick={e => e.stopPropagation()}>
        <h3 className="admin-modal-content h3">{project ? 'Modifier le projet' : 'Ajouter un projet'}</h3>
        <form onSubmit={handleSubmit}>
          <label className="admin-form-label">Titre*
            <input className="admin-form-input" name="titre" value={form.titre} onChange={handleChange} required maxLength={255} />
          </label>
          <label className="admin-form-label">Description*
            <textarea className="admin-form-input" name="description" value={form.description} onChange={handleChange} required />
          </label>
          <label className="admin-form-label">Images (URL ou texte)
            <input className="admin-form-input" name="images" value={form.images} onChange={handleChange} />
          </label>
          <label className="admin-form-label">Statut
            <select className="admin-form-input" name="statut" value={form.statut} onChange={handleChange}>
              <option>En cours</option>
              <option>Terminé</option>
              <option>Publié</option>
            </select>
          </label>
          <label className="admin-form-label">Type de service*
            <select className="admin-form-input" name="typeServiceId" value={form.typeServiceId} onChange={handleChange} required>
              <option value="">--Choisir--</option>
              {services.map(s => <option key={s.idService} value={s.idService}>{s.titre}</option>)}
            </select>
          </label>
          <label className="admin-form-label">Client
            <select className="admin-form-input" name="clientId" value={form.clientId} onChange={handleChange}>
              <option value="">--Aucun--</option>
              {clients.map(c => <option key={c.idUtilisateur} value={c.idUtilisateur}>{c.nom} {c.prenom}</option>)}
            </select>
          </label>
          <label className="admin-form-label">Employé
            <select className="admin-form-input" name="employeId" value={form.employeId} onChange={handleChange}>
              <option value="">--Aucun--</option>
              {employes.map(e => <option key={e.idUtilisateur} value={e.idUtilisateur}>{e.nom} {e.prenom}</option>)}
            </select>
          </label>
          <div className="admin-form-actions">
            <button type="button" className="admin-btn-secondary" style={{padding:'8px 18px',fontSize:'1rem'}} onClick={onClose}>Annuler</button>
            <button type="submit" className="admin-btn-primary" style={{padding:'8px 18px',fontSize:'1rem'}}>{project ? 'Modifier' : 'Ajouter'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProjectModal; 