import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Users, FileText, Send } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background-color: #FFFFFF;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-family: 'Poppins', sans-serif;
  font-size: 32px;
  font-weight: bold;
  color: #1A1A1A;
`;

const Section = styled.div`
  background-color: #FFFFFF;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #4B5563;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  color: #1A1A1A;
  padding: 12px;
  text-align: left;
  background-color: #F3F4F6;
`;

const Td = styled.td`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #1A1A1A;
  padding: 12px;
  border-top: 1px solid #E5E7EB;
`;

const ActionButton = styled.button`
  background-color: #34C759;
  color: #FFFFFF;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  cursor: pointer;
  margin-right: 8px;

  &:hover {
    background-color: #2CA749;
  }
`;

const EmployeeDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [devis, setDevis] = useState([]);

  // Simuler des données (à remplacer par API)
  useEffect(() => {
    setProjects([
      { id: 1, title: 'Site E-commerce', status: 'En cours', service: 'Création de sites web' },
      { id: 2, title: 'App Mobile', status: 'Terminé', service: 'Applications mobiles' },
    ]);
    setDevis([
      { id: 1, client: 'Jean Dupont', description: 'Devis pour site web' },
    ]);
  }, []);

  const updateProjectStatus = (id, newStatus) => {
    setProjects(projects.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  const respondToDevis = (id) => {
    alert(`Réponse envoyée pour le devis ${id}`);
    // Logique pour envoyer une réponse (ex. : API call)
  };

  const publishSocialUpdate = () => {
    const update = prompt('Entrez une mise à jour pour les réseaux sociaux :');
    if (update) alert(`Mise à jour publiée : ${update}`);
    // Logique pour publier (ex. : API call)
  };

  return (
    <>
      <Navbar />
      <DashboardContainer>
        <Header>
          <Title>Espace Employé</Title>
          <Users size={24} color="#005DAA" />
        </Header>
        <Section>
          <h2 style={{ fontFamily: 'Poppins', fontSize: '20px', color: '#1A1A1A' }}>Gestion des Projets</h2>
          <Table>
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>Titre</Th>
                <Th>Statut</Th>
                <Th>Service</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <Td>{project.id}</Td>
                  <Td>{project.title}</Td>
                  <Td>{project.status}</Td>
                  <Td>{project.service}</Td>
                  <Td>
                    <select
                      onChange={(e) => updateProjectStatus(project.id, e.target.value)}
                      value={project.status}
                      style={{ padding: '4px', borderRadius: '4px', border: '1px solid #4B5563' }}
                    >
                      <option value="En cours">En cours</option>
                      <option value="Terminé">Terminé</option>
                      <option value="Annulé">Annulé</option>
                    </select>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Section>
        <Section>
          <h2 style={{ fontFamily: 'Poppins', fontSize: '20px', color: '#1A1A1A' }}>Gestion des Devis</h2>
          <Table>
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>Client</Th>
                <Th>Description</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {devis.map((devis) => (
                <tr key={devis.id}>
                  <Td>{devis.id}</Td>
                  <Td>{devis.client}</Td>
                  <Td>{devis.description}</Td>
                  <Td><ActionButton onClick={() => respondToDevis(devis.id)}>Répondre</ActionButton></Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Section>
        <Section>
          <h2 style={{ fontFamily: 'Poppins', fontSize: '20px', color: '#1A1A1A' }}>Réseaux Sociaux</h2>
          <ActionButton onClick={publishSocialUpdate}>
            <Send size={16} /> Publier une Mise à Jour
          </ActionButton>
        </Section>
      </DashboardContainer>
      <Footer />
    </>
  );
};

export default EmployeeDashboard;