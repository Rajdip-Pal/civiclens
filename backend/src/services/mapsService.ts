import axios from 'axios';

// Using OpenStreetMap's free Nominatim API - NO API KEY REQUIRED!
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';

export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
        // OpenStreetMap Nominatim requires a User-Agent header
        const response = await axios.get(
            `${NOMINATIM_URL}/reverse?format=json&lat=${lat}&lon=${lng}`,
            {
                headers: {
                    'User-Agent': 'CivicLens/1.0' // Required by Nominatim
                }
            }
        );

        if (response.data && response.data.display_name) {
            return response.data.display_name;
        }
        return `${lat}, ${lng}`;
    } catch (error) {
        console.error('Geocoding error:', error);
        return `${lat}, ${lng}`;
    }
};

export const getPlaceDetails = async (placeId: string): Promise<any> => {
    try {
        // OpenStreetMap lookup by OSM ID
        const response = await axios.get(
            `${NOMINATIM_URL}/lookup?format=json&osm_ids=${placeId}`,
            {
                headers: {
                    'User-Agent': 'CivicLens/1.0'
                }
            }
        );

        return response.data[0] || null;
    } catch (error) {
        console.error('Place details error:', error);
        return null;
    }
};
