import React from 'react';
import styled from 'styled-components';

const BoxContainer = styled.div`
  border: 2px solid #3478f6;  
  margin-bottom: 20px;
  padding: 5px;
  background-color: #000;  
  transition: background-color 0.3s, box-shadow 0.3s;
  
  &:hover {
    background-color: #1a2f40;  
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5); 
    
  }

  `;

const Title = styled.h3`
  border-bottom: 2.5px solid burlywood;  
  padding-bottom: 9px;
  color: white;  
  text-align:center;
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  margin: 15px 1px;
  color: white;  
`;

const ColorIndicator = styled.span`
  height: 11px;
  width: 11px;
  background-color: ${props => props.color};
  border-radius: 50%;
  display: inline-block;
  margin-right: 11px;
`;

const Flag = styled.img`
  width: 20px;  
  height: 15px;  
  object-fit: cover;  
  margin-right: 10px;  
  vertical-align: middle;  
`;

const StatBox = ({ title, items }) => {
  return (
    <BoxContainer>
      <Title>{title}</Title>
      {items.map((item, index) => (
        <ListItem key={index}>
          {item.color && <ColorIndicator color={item.color} />}
          {item.flag && <Flag src={item.flag} alt={`${item.name} flag`} />}
          {item.name}
        </ListItem>
      ))}
    </BoxContainer>
  );
};

export default StatBox;
