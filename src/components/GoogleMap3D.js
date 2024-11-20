import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const GoogleAPIKey = 'AIzaSyDDGQQEA0grrP2FPL_iNZhEX0hlxTOMuwM';

const initMap = async () => {
    console.log('initMap');
    try {
        const { Map3DElement } = await window.google.maps.importLibrary('maps3d');
        const map3DElement = new Map3DElement({
            center: { lat: 45.350590, lng: -75.927760, altitude: 400 },
            range: 1000,
            tilt: 67.5,
        });
        return map3DElement;
    } catch (error) {
        console.error('Error loading Google Maps API:', error);
    }
};

const GoogleMap3D = () => {
    const mapRef = useRef(null);
    const [map3DElement, setMap3DElement] = useState(null);

    useEffect(() => {
        const loadMap = async () => {
            const map3DElement = await initMap();
            setMap3DElement(map3DElement);
            document.body.appendChild(map3DElement);
        };

        loadMap();
    }, []);

    return (
        <div>
           
        </div>
    );
};

export default GoogleMap3D;
