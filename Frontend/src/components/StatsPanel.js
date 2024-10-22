import React from 'react';
import styled from 'styled-components';
import StatBox from './StatBox';
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from 'react-icons/fa'; 

const PanelContainer = styled.div`
  padding: 14px;
  height: 100vh;
  width: 245px;
  overflow-y: auto;
  background: #000;
  position: fixed;
  right: ${props => (props.isOpen ? '0' : '-300px')}; 
  top: 0;
  transition: right 0.4s ease-in-out;
  z-index: 10;
`;

const ToggleIcon = styled.div`
  position: fixed;
  right: 35px;
  bottom: 13px;
  cursor: pointer;
  color: white;
  background-color: #2c3e50;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 37px;
  height: 35px;
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
`;

const QuoteBox = styled.div`
  color: white;
  background-color: #1A2S5E;
  padding: 10px;
  margin-bottom: 20px;
  text-align: center;
  border: 1.9px solid #3478f6;
  font-size: 0.9em;
  font-weight: bold;
  margin-top: 59px;
  z-index: 999;
`;

const StatsPanel = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <>
      <PanelContainer isOpen={isSidebarOpen}>
        <QuoteBox>SAVE YOURSELF FROM CYBER ATTACK</QuoteBox>
        <StatBox
          title="Types of Cyber Attacks"
          items={[
            { name: 'Phishing', color: 'red' },
            { name: 'DDoS', color: 'yellow' },
            { name: 'Malware', color: 'orange' }
          ]}
        />
        <StatBox
          title="Targeted Nations"
          items={[
            { name: 'Ethiopia', flag: '/ethiopia.png' },
            { name: 'Mongolia', flag: '/mongolia.png' },
            { name: 'Nepal', flag: '/nepal.webp' },
            { name: 'Angola', flag: '/angola.png' }
          ]}
        />
        <StatBox
          title="Top Targeted Industries"
          items={[
            { name: 'Education', flag: '/education.png' },
            { name: 'Government', flag: '/govt.png' },
            { name: 'Telecommunication', flag: '/mobile.png' },
            { name: 'Healthcare', flag: '/healthcare.png' }
          ]}
        />
      </PanelContainer>
      <ToggleIcon onClick={toggleSidebar}>
        {isSidebarOpen ? <FaArrowAltCircleLeft size="20" /> : <FaArrowAltCircleRight size="20" />}
      </ToggleIcon>
    </>
  );
};

export default StatsPanel;
