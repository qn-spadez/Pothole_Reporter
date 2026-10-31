import type { PotholeReport } from '../types/report';

export function exportReportsAsJSON(reports: PotholeReport[], filename = 'bengaluru-pothole-reports.json') {
  const jsonStr = JSON.stringify(reports, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportReportsAsGeoJSON(reports: PotholeReport[], filename = 'bengaluru-potholes.geojson') {
  const geojson = {
    type: 'FeatureCollection',
    metadata: {
      generatedAt: new Date().toISOString(),
      targetCity: 'Bengaluru, India',
      source: 'Pothole Reporter Civic Tech Platform (Demo)',
      totalFeatures: reports.length,
    },
    features: reports.map((r) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [r.longitude, r.latitude],
      },
      properties: {
        id: r.id,
        roadName: r.roadName,
        zone: r.zone,
        wardNumber: r.wardNumber,
        status: r.status,
        priority: r.priority,
        aiInferenceType: r.realAiDetection ? 'real_yolov8' : (r.simulatedAiDetection ? 'simulated_demo' : 'none'),
        potholesDetected: r.realAiDetection?.potholesDetected ?? (r.simulatedAiDetection?.potholeDetected ? 1 : 0),
        topConfidence: r.realAiDetection
          ? Math.round(r.realAiDetection.highestConfidence * 100)
          : (r.simulatedAiDetection?.confidenceScore ?? null),
        depthCm: r.simulatedAiDetection?.estimatedDepthCm ?? null,
        surfaceAreaSqM: r.simulatedAiDetection?.estimatedSurfaceAreaSqM ?? null,
        reportedAt: r.createdAt,
      },
    })),
  };

  const jsonStr = JSON.stringify(geojson, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/geo+json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
