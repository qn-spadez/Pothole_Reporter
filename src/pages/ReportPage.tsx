import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send,
  Info,
  CheckCircle2,
  Cpu,
  ArrowLeft,
} from 'lucide-react';
import { useReports } from '../context/ReportContext';
import { ImageUploader } from '../components/submission/ImageUploader';
import { LocationPicker } from '../components/submission/LocationPicker';
import { Button } from '../components/common/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import type { BBMPZone, ReportPriority } from '../types/report';

export const ReportPage: React.FC = () => {
  const navigate = useNavigate();
  const { addReport } = useReports();

  // Form State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [roadName, setRoadName] = useState('');
  const [zone, setZone] = useState<BBMPZone>('Mahadevapura');
  const [wardNumber, setWardNumber] = useState<number>(150);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [description, setDescription] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [priority, setPriority] = useState<ReportPriority>('high');

  // Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    id: string;
    roadName: string;
    priority: ReportPriority;
  } | null>(null);

  const zones: BBMPZone[] = [
    'Mahadevapura',
    'Bommanahalli',
    'East Zone',
    'West Zone',
    'South Zone',
    'Rajarajeshwari Nagar',
    'Yelahanka',
    'Dasarahalli',
  ];

  const handleImageSelected = (file: File | null, previewUrl: string | null) => {
    setImageFile(file);
    setImagePreviewUrl(previewUrl);
    if (previewUrl && errors.image) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.image;
        return copy;
      });
    }
  };

  const handleLocationChange = (
    lat: string,
    lng: string,
    road?: string,
    z?: BBMPZone,
    w?: number
  ) => {
    setLatitude(lat);
    setLongitude(lng);
    if (road) setRoadName(road);
    if (z) setZone(z);
    if (w) setWardNumber(w);

    if (errors.latitude || errors.longitude) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.latitude;
        delete copy.longitude;
        return copy;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!imagePreviewUrl) {
      newErrors.image = 'Road defect photograph is required.';
    }

    if (!latitude) {
      newErrors.latitude = 'Latitude is required.';
    } else {
      const latNum = parseFloat(latitude);
      if (isNaN(latNum) || latNum < -90 || latNum > 90) {
        newErrors.latitude = 'Please enter a valid latitude (-90 to 90).';
      }
    }

    if (!longitude) {
      newErrors.longitude = 'Longitude is required.';
    } else {
      const lngNum = parseFloat(longitude);
      if (isNaN(lngNum) || lngNum < -180 || lngNum > 180) {
        newErrors.longitude = 'Please enter a valid longitude (-180 to 180).';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate short network delay for realistic feel
    setTimeout(() => {
      const newReport = addReport({
        roadName: roadName.trim() || 'Unspecified Bengaluru Corridor',
        zone,
        wardNumber: Number(wardNumber) || 150,
        description: description.trim(),
        status: 'submitted',
        priority,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        imageUrl:
          imagePreviewUrl ||
          'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
        reporterName: reporterName.trim() || 'Anonymous Citizen',
        reporterContact: reporterContact.trim() || '+91 Unspecified',
        simulatedAiDetection: {
          potholeDetected: true,
          confidenceScore: 93.8,
          estimatedSeverity: priority,
          estimatedDepthCm: priority === 'critical' ? 14.8 : priority === 'high' ? 11.2 : 6.5,
          estimatedSurfaceAreaSqM: priority === 'critical' ? 0.95 : 0.6,
          detectedFeatures: ['Asphalt rim cavitation', 'Simulated road defect feature'],
        },
      });

      setIsSubmitting(false);
      setSubmissionSuccess({
        id: newReport.id,
        roadName: newReport.roadName,
        priority: newReport.priority,
      });
    }, 600);
  };

  const handleResetForAnother = () => {
    setImageFile(null);
    setImagePreviewUrl(null);
    setRoadName('');
    setLatitude('');
    setLongitude('');
    setDescription('');
    setSubmissionSuccess(null);
    setErrors({});
  };

  if (submissionSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <Card className="border-emerald-200 bg-white p-8 text-center space-y-5 shadow-lg">
          <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div>
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest block">
              Complaint Successfully Lodged
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              Report ID: {submissionSuccess.id}
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
              Your defect report on <strong>{submissionSuccess.roadName}</strong> has been
              registered in the BBMP civic dashboard.
            </p>
          </div>

          {/* Simulated Edge AI Notification */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-left max-w-md mx-auto text-xs space-y-2">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-amber-600" />
              <span className="font-bold text-amber-900">
                Simulated AI Triage Assessment
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Automated image segmentation and spatial duplicate clustering ran against
              active reports. Priority assigned:{' '}
              <strong className="uppercase text-amber-900 font-bold">
                {submissionSuccess.priority}
              </strong>
              .
            </p>
            <span className="text-[10px] text-amber-700 block font-mono">
              Note: This assessment is simulated for prototype demonstration.
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleResetForAnother}
              className="text-xs"
            >
              Submit Another Report
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/reports')}
              className="text-xs font-bold"
            >
              View in Reports Table
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Citizen Grievance Submission
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
          Report a Bengaluru Pothole or Road Defect
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Upload photo evidence, pinpoint coordinates, and provide road details for municipal
          verification.
        </p>
      </div>

      {/* Simulated AI disclaimer alert */}
      <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/70 flex items-start gap-3 text-xs text-amber-900">
        <Info className="h-4.5 w-4.5 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Simulated AI & Duplicate Detection Notice:</strong> In this Phase 1 prototype,
          image defect scoring and spatial duplicate detection are simulated in client memory. No
          real civic complaint is transmitted to live municipal authorities.
        </div>
      </div>

      {/* Main Submission Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Image Upload */}
        <Card>
          <CardHeader>
            <CardTitle>1. Road Photograph & Visual Evidence</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUploader
              imageFile={imageFile}
              imagePreviewUrl={imagePreviewUrl}
              onImageSelected={handleImageSelected}
              error={errors.image}
            />
          </CardContent>
        </Card>

        {/* Step 2: Location & GPS */}
        <Card>
          <CardHeader>
            <CardTitle>2. Pothole Location & Ward</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <LocationPicker
              latitude={latitude}
              longitude={longitude}
              roadName={roadName}
              selectedZone={zone}
              selectedWard={wardNumber}
              onLocationChange={handleLocationChange}
              latError={errors.latitude}
              lngError={errors.longitude}
            />

            {/* Road Name & BBMP Zone details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Road Name or Landmark (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Outer Ring Road, Near Bellandur Flyover"
                  value={roadName}
                  onChange={(e) => setRoadName(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  BBMP Municipal Zone
                </label>
                <select
                  value={zone}
                  onChange={(e) => setZone(e.target.value as BBMPZone)}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-slate-900 focus:bg-white focus:outline-none font-medium text-slate-800"
                >
                  {zones.map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Defect Details & Reporter Info */}
        <Card>
          <CardHeader>
            <CardTitle>3. Defect Description & Reporter Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Description of Defect & Traffic Impact (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Describe hazard: crater depth, traffic slowdowns, water pooling, two-wheeler risk..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-slate-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Estimated Hazard Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as ReportPriority)}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-slate-900 focus:bg-white focus:outline-none font-medium text-slate-800"
                >
                  <option value="critical">Critical (Accident hazard / deep crater)</option>
                  <option value="high">High (Heavy traffic impact)</option>
                  <option value="medium">Medium (Moderate road depression)</option>
                  <option value="low">Low (Surface erosion / small hole)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Contact Number (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. +91 98765 43210"
                  value={reporterContact}
                  onChange={(e) => setReporterContact(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-slate-900 focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-slate-500">
            Submission will trigger client-side spatial duplicate check against active Bengaluru
            reports.
          </p>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/')}
              className="w-full sm:w-auto text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              leftIcon={<Send className="h-4 w-4 text-amber-400" />}
              className="w-full sm:w-auto font-bold text-sm shadow-sm"
            >
              Submit Defect Report
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
