import React, { useState } from 'react';
import './App.css';
import StatsPanel from './components/StatsPanel';

import Header from './components/Header';  
import MapComponent from './components/MapComponent';
import Sidebar from './components/Sidebar';  

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);  
  const [attackSpeed, setAttackSpeed] = useState(1500);       

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSpeedChange = (newSpeed) => {
    setAttackSpeed(newSpeed);
  };

  const handleUpdateAttacks = (newCount) => {
    console.log('Updated attack count to:', newCount);
  };

  return (
    <div className="App">
      <Header />  
      <div className="top-border"></div>  
      <div className="content">
        <MapComponent isSidebarOpen={isSidebarOpen} attackSpeed={attackSpeed} /> 
        <StatsPanel 
          toggleSidebar={toggleSidebar} 
          isSidebarOpen={isSidebarOpen} 
        />
      </div>
      <Sidebar 
        handleSpeedChange={handleSpeedChange} 
        handleUpdateAttacks={handleUpdateAttacks} 
      />
    </div>
  );
}

export default App;
