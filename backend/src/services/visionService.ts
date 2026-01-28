import vision from '@google-cloud/vision';

const client = new vision.ImageAnnotatorClient();

export const analyzeImageSafety = async (imageBase64: string): Promise<boolean> => {
    try {
        const [result] = await client.safeSearchDetection({
            image: { content: imageBase64.split(',')[1] || imageBase64 },
        });

        const detections = result.safeSearchAnnotation;
        if (!detections) return true;

        // Check for inappropriate content
        const isUnsafe =
            detections.adult === 'VERY_LIKELY' ||
            detections.violence === 'VERY_LIKELY' ||
            detections.racy === 'VERY_LIKELY';

        return !isUnsafe;
    } catch (error) {
        console.error('Vision API error:', error);
        return true; // Allow image if API fails
    }
};

export const detectLabels = async (imageBase64: string): Promise<string[]> => {
    try {
        const [result] = await client.labelDetection({
            image: { content: imageBase64.split(',')[1] || imageBase64 },
        });

        const labels = result.labelAnnotations || [];
        return labels.slice(0, 10).map(label => label.description || '');
    } catch (error) {
        console.error('Label detection error:', error);
        return [];
    }
};

export const detectText = async (imageBase64: string): Promise<string> => {
    try {
        const [result] = await client.textDetection({
            image: { content: imageBase64.split(',')[1] || imageBase64 },
        });

        const detections = result.textAnnotations;
        if (!detections || detections.length === 0) return '';

        return detections[0].description || '';
    } catch (error) {
        console.error('Text detection error:', error);
        return '';
    }
};
