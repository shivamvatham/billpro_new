import React from 'react';
import { useSelector } from 'react-redux';

const AppBar = () => {
  const name = useSelector((state)=> state.navBar.titleName )
  return (
    <div style={{
      height: '60px',
      backgroundColor: '#9fbdfd',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'fixed',
      top: 0,
      left: '230px',
      right: 0,
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '500' }}>
          BillPro
        </h1>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{
          width: 'auto',
          height: '32px',
          borderRadius: '5px',
          padding: '5px',
          backgroundColor: '#fff',
          color: '#1976d2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          {name}
        </div>
      </div>
    </div>
  );
};

export default AppBar;