async function loadGoogleMapsApi() {
    const scriptLoaded = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        const params = new URLSearchParams({ key: GoogleAPIKey, v: 'alpha', libraries: 'maps3d' });
        script.src = `https://maps.googleapis.com/maps/api/js?${params}`;
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        script.onerror = () => reject(Error("The Google Maps JavaScript API could not load."));
        document.head.appendChild(script);
    });

    await scriptLoaded;

    return window.google.