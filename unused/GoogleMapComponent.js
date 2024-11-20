import React, { useEffect } from 'react';

const GoogleMapComponent = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = './maps.js';
    script.async = true;

    // Function to execute once the script has loaded
    script.onload = () => {
      console.log('Script loaded successfully');
      // You can call any functions or execute any code from maps.js here
    };

    script.onerror = () => {
      console.error('Script failed to load');
    };

    document.body.appendChild(script);

    // Cleanup script when component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div id="map" style={{ width: '100%', height: '100vh' }}></div>;
};

export default GoogleMapComponent;
