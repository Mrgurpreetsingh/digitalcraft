import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background-color: #FFFFFF;
  padding: 20px;
  border-radius: 8px;
  text-align: left;
  color: #1E293B;
`;

const Title = styled.h3`
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  margin-bottom: 10px;
`;

const Description = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #64748B;
  margin-bottom: 10px;
`;

const List = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ListItem = styled.li`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #10B981;
  margin-bottom: 5px;

  &:before {
    content: '✓ ';
  }
`;

const Link = styled.a`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #1E40AF;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

function ServiceCard({ title, description, items, linkText }) {
  return (
    <Card>
      <Title>{title}</Title>
      <Description>{description}</Description>
      <List>
        {items.map((item, index) => (
          <ListItem key={index}>{item}</ListItem>
        ))}
      </List>
      <Link href="#">{linkText} →</Link>
    </Card>
  );
}

export default ServiceCard;