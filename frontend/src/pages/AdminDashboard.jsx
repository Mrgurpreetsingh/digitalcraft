import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Settings, Users, BarChart2 } from 'lucide-react';
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

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background-color: #FFFFFF;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #4B5563;
  text-align: center;
`;

const StatValue = styled.p`
  font-family: 'Poppins', sans-serif;
  font-size: 24px;
  color: #005DAA;
  margin: 8px 0;
`;

const StatLabel = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #4B5563;
`;

const TableContainer = styled.div`
  background-color: #FFFFFF;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #4B5563;
  overflow-x: auto;
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

  &:active {
    background-color: #248F39;
  }
`;

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    projects: 0,
    services: 0,
  });
  const [users, setUsers] = useState([]);

  // Simuler des données (à remplacer par une API call)
  useEffect(() => {
    setStats({ users: 15, projects: 10, services: 5 });
    setUsers([
      { id: 1, name: 'Jean Dupont', email: 'jean@example.com', role: 'Administrateur' },
      { id: 2, name: 'Marie Martin', email: 'marie@example.com', role: 'Employé' },
    ]);
  }, []);

  return (
    <>
      <DashboardContainer>
        <Header>
          <Title>Tableau de Bord Admin</Title>
          <Settings size={24} color="#005DAA" />
        </Header>
        <StatsContainer>
          <StatCard>
            <BarChart2 size={32} color="#005DAA" />
            <StatValue>{stats.users}</StatValue>
            <StatLabel>Utilisateurs</StatLabel>
          </StatCard>
          <StatCard>
            <BarChart2 size={32} color="#005DAA" />
            <StatValue>{stats.projects}</StatValue>
            <StatLabel>Projets</StatLabel>
          </StatCard>
          <StatCard>
            <BarChart2 size={32} color="#005DAA" />
            <StatValue>{stats.services}</StatValue>
            <StatLabel>Services</StatLabel>
          </StatCard>
        </StatsContainer>
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>Nom</Th>
                <Th>Email</Th>
                <Th>Rôle</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <Td>{user.id}</Td>
                  <Td>{user.name}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.role}</Td>
                  <Td>
                    <ActionButton>Modifier</ActionButton>
                    <ActionButton style={{ backgroundColor: '#D32F2F' }}>Supprimer</ActionButton>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      </DashboardContainer>
    </>
  );
};

export default AdminDashboard;