import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  X,
  FileWarning,
  Sparkles,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '../common/Button';

interface ImageUploaderProps {
  imageFile: File | null;
  imagePreviewUrl: string | null;
  onImageSelected: (file: File | null, previewUrl: string | null) => void;
  error?: string;
}

const SAMPLE_DEFECT_IMAGES = [
  {
    label: 'Crater (Outer Ring Rd)',
    url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Surface Breakdown (Indiranagar)',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Sub-base Pit (Silk Board)',
    url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80',
  },
];

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  imageFile,
  imagePreviewUrl,
  onImageSelected,
  error,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
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
    onImageSelected(null, sampleUrl);
  };

  const handleClear = () => {
    if (inputRef.current) inputRef.current.value = '';
    setValidationError(null);
    onImageSelected(null, null);
  };

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
          <div className="relative rounded-xl overflow-hidden border border-slate-300 bg-slate-900 aspect-video max-h-72 flex items-center justify-center">
            <img
              src={imagePreviewUrl}
              alt="Uploaded road defect preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={handleClear}
              aria-label="Remove image"
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-red-600 transition-colors shadow-md"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Simulated Edge Detection Overlay */}
            <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-md rounded-lg p-3 text-white border border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
                <div>
                  <p className="text-xs font-bold text-amber-300">
                    Simulated AI Detection: Severe Cavity
                  </p>
                  <p className="text-[10px] text-slate-300">
                    Est. Confidence 94.6% • Depth ~12cm • Simulated for demo
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                EDGE AI
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              {imageFile ? `${imageFile.name} (${(imageFile.size / 1024 / 1024).toFixed(2)} MB)` : 'Preset Demo Evidence Image'}
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
            High quality road surface photos enable automated severity scoring
          </p>

          {/* Quick select demo presets */}
          <div
            className="mt-4 pt-3 border-t border-slate-200 w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-[11px] text-slate-400 font-medium block mb-2">
              Or pick a sample Bengaluru road defect image:
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
