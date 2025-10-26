import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ModalAssignationDevis.css';


const ModalAssignationDevis = ({ isOpen, onClose, quote, onAssigned }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
      // Pré-sélectionner l'employé si le devis est déjà assigné
      if (quote?.employeId) {
        setSelectedEmployeeId(quote.employeId);
      }
    }
  }, [isOpen, quote]);


  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/utilisateurs/employees-and-admins', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Filtrer uniquement les employés
      const employesList = res.data.data.filter(user => user.role === 'Employé');
      setEmployees(employesList);
    } catch (err) {
      console.error('Erreur lors du chargement des employés:', err);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!selectedEmployeeId) {
      alert('Veuillez sélectionner un employé');
      return;
    }


    try {
      setLoading(true);
      const token = localStorage.getItem('token');


      // Mettre à jour le devis avec l'employé assigné
      await axios.put(`http://localhost:5000/api/devis/${quote.idDevis}`, {
        statut: quote.statut || 'En attente',
        employeId: selectedEmployeeId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });


      // Informer le parent que l'assignation a réussi
      if (onAssigned) {
        onAssigned(quote.idDevis, selectedEmployeeId);
      }


      alert('Devis assigné avec succès !');
      onClose();
    } catch (err) {
      console.error('Erreur lors de l\'assignation:', err);
      alert('Erreur lors de l\'assignation du devis');
    } finally {
      setLoading(false);
    }
  };


  if (!isOpen || !quote) return null;


  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content assign-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Assigner le Devis #{quote.numeroDevis || quote.numero}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>


        <div className="modal-body">
          <div className="quote-info">
            <p><strong>Demandeur :</strong> {quote?.nomDemandeur} {quote?.prenomDemandeur}</p>
            <p><strong>Email :</strong> {quote?.emailDemandeur}</p>
            <p><strong>Service :</strong> {quote?.serviceNom}</p>
            <p><strong>Budget :</strong> {quote?.budgetEstime}€</p>
          </div>


          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="employee">Assigner à l'employé :</label>
              <select
                id="employee"
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                required
                className="form-select"
              >
                <option value="">-- Sélectionner un employé --</option>
                {employees.map(emp => (
                  <option key={emp.idUtilisateur} value={emp.idUtilisateur}>
                    {emp.nom} {emp.prenom} ({emp.email})
                  </option>
                ))}
              </select>
            </div>


            <div className="modal-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Assignation...' : '✓ Assigner'}
              </button>
              <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


export default ModalAssignationDevis;






