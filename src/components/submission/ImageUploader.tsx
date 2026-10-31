import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  X,
  FileWarning,
  Sparkles,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  Eye,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { Button } from '../common/Button';
import type { DetectionResponse } from '../../services/api';

interface ImageUploaderProps {
  imageFile: File | null;
  imagePreviewUrl: string | null;
  onImageSelected: (file: File | null, previewUrl: string | null) => void;
  error?: string;
  isDetecting?: boolean;
  detectionResult?: DetectionResponse | null;
  detectionError?: string | null;
  onRetryDetection?: () => void;
}

const SAMPLE_DEFECT_IMAGES = [
  {
    label: 'Crater (Outer Ring Rd) • 2 Potholes',
    url: '/samples/sample1.jpg',
  },
  {
    label: 'Clean Road (Indiranagar) • 0 Potholes',
    url: '/samples/sample2.jpg',
  },
  {
    label: 'Deep Rut (Silk Board) • 1 Pothole',
    url: '/samples/sample3.jpg',
  },
];

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  imageFile,
  imagePreviewUrl,
  onImageSelected,
  error,
  isDetecting = false,
  detectionResult = null,
  detectionError = null,
  onRetryDetection,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showAnnotated, setShowAnnotated] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndProcessFile = (file: File) => {
    setValidationError(null);

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setValidationError('Invalid file format. Please upload JPG, PNG, or WebP.');
      return;
    }

    // 10 MB limit
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setValidationError('File exceeds 10MB limit. Please upload a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setShowAnnotated(true);
      onImageSelected(file, e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const handleSelectSample = async (sampleUrl: string) => {
    setValidationError(null);
    setShowAnnotated(true);
    try {
      const res = await fetch(sampleUrl);
      const blob = await res.blob();
      const filename = sampleUrl.split('/').pop() || 'sample.jpg';
      const file = new File([blob], filename, { type: blob.type || 'image/jpeg' });
      onImageSelected(file, sampleUrl);
    } catch {
      onImageSelected(null, sampleUrl);
    }
  };

  const handleClear = () => {
    if (inputRef.current) inputRef.current.value = '';
    setValidationError(null);
    setShowAnnotated(true);
    onImageSelected(null, null);
  };

  const activeDisplayUrl =
    showAnnotated && detectionResult?.annotated_image
      ? detectionResult.annotated_image
      : imagePreviewUrl;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
          Road Defect Image Evidence <span className="text-red-500">*</span>
        </label>
        <span className="text-xs text-slate-400">JPG, PNG, WebP (Max 10MB)</span>
      </div>

      {imagePreviewUrl ? (
        <div className="space-y-3">
          <div className="relative rounded-xl overflow-hidden border border-slate-300 bg-slate-900 aspect-video max-h-80 flex items-center justify-center">
            {activeDisplayUrl && (
              <img
                src={activeDisplayUrl}
                alt="Road defect evidence"
                className="w-full h-full object-cover transition-opacity duration-200"
              />
            )}

            <button
              type="button"
              onClick={handleClear}
              aria-label="Remove image"
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-red-600 transition-colors shadow-md z-10"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Toggle Annotated vs Original if detections exist */}
            {detectionResult?.annotated_image && (
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md p-1 rounded-lg border border-slate-700 z-10">
                <button
                  type="button"
                  onClick={() => setShowAnnotated(true)}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded transition-colors ${
                    showAnnotated
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  YOLO Bounding Boxes
                </button>
                <button
                  type="button"
                  onClick={() => setShowAnnotated(false)}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded transition-colors ${
                    !showAnnotated
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Original Photo
                </button>
              </div>
            )}

            {/* In-Flight Detecting Overlay */}
            {isDetecting && (
              <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex flex-col items-center justify-center text-white z-20 animate-fade-in">
                <Loader2 className="h-8 w-8 text-amber-400 animate-spin mb-2" />
                <p className="text-sm font-bold text-slate-100">Running Real YOLOv8 AI Inference...</p>
                <p className="text-xs text-slate-400 mt-0.5">Analyzing road surface for cavitation & bounding boxes</p>
              </div>
            )}

            {/* Real AI Inference Outcome Badge */}
            {!isDetecting && detectionResult && (
              <div className="absolute bottom-3 left-3 right-3 bg-slate-950/90 backdrop-blur-md rounded-lg p-3 text-white border border-slate-700 flex flex-wrap items-center justify-between gap-2 z-10">
                <div className="flex items-center gap-2.5">
                  {detectionResult.potholes_detected > 0 ? (
                    <div className="h-7 w-7 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                      <Sparkles className="h-4 w-4" />
                    </div>
                  ) : (
                    <div className="h-7 w-7 rounded-md bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-white">
                        {detectionResult.potholes_detected > 0
                          ? `Real AI Inference: ${detectionResult.potholes_detected} Pothole${detectionResult.potholes_detected > 1 ? 's' : ''} Detected`
                          : '0 Potholes Detected by YOLOv8'}
                      </p>
                      <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                        REAL MODEL
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      {detectionResult.potholes_detected > 0
                        ? `Peak Confidence: ${(detectionResult.highest_confidence * 100).toFixed(1)}% (model score) • Latency: ${detectionResult.inference_time_ms}ms`
                        : `No road cavitation meeting 0.25 confidence threshold • Latency: ${detectionResult.inference_time_ms}ms`}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-mono">
                    Model: {detectionResult.model_name}
                  </span>
                  <span className="text-[10px] text-amber-300 font-semibold block">
                    Depth Not Estimated (2D RGB)
                  </span>
                </div>
              </div>
            )}

            {/* Inference Error Notification */}
            {!isDetecting && detectionError && (
              <div className="absolute bottom-3 left-3 right-3 bg-red-950/90 backdrop-blur-md rounded-lg p-3 text-white border border-red-800 flex items-center justify-between gap-2 z-10">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-red-200">Backend AI Inference Unavailable</p>
                    <p className="text-[10px] text-red-300 line-clamp-1">{detectionError}</p>
                  </div>
                </div>
                {onRetryDetection && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onRetryDetection}
                    className="text-xs py-1 px-2.5 bg-red-900/60 border-red-700 text-red-100 hover:bg-red-800"
                  >
                    Retry Scan
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Detections Detail Strip if detected */}
          {detectionResult && detectionResult.detections.length > 0 && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 text-slate-500" />
                  Bounding Box Coordinates & Class Confidence (Model Outputs):
                </span>
                <span className="text-[11px] text-slate-500">
                  Image size: {detectionResult.image_width} × {detectionResult.image_height} px
                </span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {detectionResult.detections.map((box, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-800 font-mono text-[11px]"
                  >
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    <strong>Pothole #{idx + 1}:</strong>
                    <span>{(box.confidence * 100).toFixed(1)}% conf</span>
                    <span className="text-slate-400">
                      [{box.x1}, {box.y1}, {box.x2}, {box.y2}]
                    </span>
                  </span>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-200/60 flex items-center gap-1">
                <Info className="h-3 w-3 shrink-0" />
                <span>
                  Confidence scores represent raw neural network outputs, not calibrated probabilities. Physical crater depth cannot be measured from a 2D photograph.
                </span>
              </p>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              {imageFile
                ? `${imageFile.name} (${(imageFile.size / 1024 / 1024).toFixed(2)} MB)`
                : 'Preset Demo Evidence Image'}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="text-xs py-1 px-2.5"
            >
              Change Image
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
            dragActive
              ? 'border-amber-500 bg-amber-50/50'
              : 'border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50/50'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleInputChange}
            className="hidden"
          />

          <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mb-3 border border-slate-200">
            <UploadCloud className="h-6 w-6 text-slate-600" />
          </div>

          <p className="text-sm font-semibold text-slate-900 text-center">
            Click to upload or drag & drop road photograph
          </p>
          <p className="text-xs text-slate-500 mt-1 text-center">
            Upload road surface photos for real-time YOLOv8 object detection and bounding box extraction
          </p>

          {/* Quick select demo presets */}
          <div
            className="mt-4 pt-3 border-t border-slate-200 w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-[11px] text-slate-400 font-medium block mb-2">
              Or pick a sample Bengaluru road photograph for real AI detection:
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {SAMPLE_DEFECT_IMAGES.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSample(sample.url)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium border border-slate-200 transition-colors"
                >
                  <ImageIcon className="h-3.5 w-3.5 text-slate-500" />
                  <span>{sample.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {(validationError || error) && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
          <FileWarning className="h-4 w-4 shrink-0" />
          <span>{validationError || error}</span>
        </div>
      )}
    </div>
  );
};
