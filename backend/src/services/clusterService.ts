import { getDistance } from 'geolib';

export interface Location {
    lat: number;
    lng: number;
}

export interface Report {
    id: string;
    location: Location;
    category: string;
    description: string;
}

export interface Cluster {
    centroid: Location;
    reports: Report[];
    category: string;
    count: number;
}

const CLUSTER_RADIUS = parseInt(process.env.CLUSTER_RADIUS_METERS || '100');

export const clusterReports = (reports: Report[]): Cluster[] => {
    const clusters: Cluster[] = [];
    const processed = new Set<string>();

    for (const report of reports) {
        if (processed.has(report.id)) continue;

        const cluster: Cluster = {
            centroid: report.location,
            reports: [report],
            category: report.category,
            count: 1,
        };

        processed.add(report.id);

        // Find nearby reports of same category
        for (const otherReport of reports) {
            if (processed.has(otherReport.id)) continue;
            if (otherReport.category !== report.category) continue;

            const distance = getDistance(
                { latitude: report.location.lat, longitude: report.location.lng },
                { latitude: otherReport.location.lat, longitude: otherReport.location.lng }
            );

            if (distance <= CLUSTER_RADIUS) {
                cluster.reports.push(otherReport);
                cluster.count++;
                processed.add(otherReport.id);
            }
        }

        // Calculate centroid
        if (cluster.reports.length > 1) {
            const avgLat = cluster.reports.reduce((sum, r) => sum + r.location.lat, 0) / cluster.reports.length;
            const avgLng = cluster.reports.reduce((sum, r) => sum + r.location.lng, 0) / cluster.reports.length;
            cluster.centroid = { lat: avgLat, lng: avgLng };
        }

        clusters.push(cluster);
    }

    return clusters.sort((a, b) => b.count - a.count);
};

export const findNearbyReports = (
    targetLocation: Location,
    reports: Report[],
    radiusMeters: number = CLUSTER_RADIUS
): Report[] => {
    return reports.filter(report => {
        const distance = getDistance(
            { latitude: targetLocation.lat, longitude: targetLocation.lng },
            { latitude: report.location.lat, longitude: report.location.lng }
        );
        return distance <= radiusMeters;
    });
};
