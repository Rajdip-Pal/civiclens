import axios from 'axios';

const MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${MAPS_API_KEY}`
        );

        if (response.data.results && response.data.results.length > 0) {
            return response.data.results[0].formatted_address;
        }
        return `${lat}, ${lng}`;
    } catch (error) {
        console.error('Geocoding error:', error);
        return `${lat}, ${lng}`;
    }
};

export const getPlaceDetails = async (placeId: string): Promise<any> => {
    try {
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${MAPS_API_KEY}`
        );

        return response.data.result;
    } catch (error) {
        console.error('Place details error:', error);
        return null;
    }
};
