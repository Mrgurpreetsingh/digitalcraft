import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background-color: var(--white);
  padding: 20px;
  border-radius: 8px;
  text-align: left;
  color: var(--text-dark);
`;

const Title = styled.h3`
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  margin-bottom: 10px;
`;

const Description = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: var(--text-light);
  margin-bottom: 10px;
`;

const List = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ListItem = styled.li`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: var(--secondary-color);
  margin-bottom: 5px;

  &:before {
    content: '✓ ';
  }
`;

const Link = styled.a`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: var(--primary-color);
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