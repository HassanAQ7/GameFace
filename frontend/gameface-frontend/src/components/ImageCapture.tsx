import { useCallback, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { HiOutlineArrowUpTray, HiOutlineCamera, HiOutlinePhoto } from "react-icons/hi2";
import Webcam from "react-webcam";

type CaptureMode = "select" | "webcam" | "upload";

interface ImageCaptureProps {
  onImageCapture: (file: File) => void;
  isLoading: boolean;
}

const WEBCAM_CONSTRAINTS: MediaStreamConstraints["video"] = {
  width: 640,
  height: 480,
  facingMode: "user",
};

function dataURLtoFile(dataURL: string, filename: string): File {
  const [header, base64] = dataURL.split(",");
  const mimeMatch = header.match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
  const binaryStr = atob(base64);
  const bytes = new Uint8Array(binaryStr.length);

  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }

  return new File([bytes], filename, { type: mime });
}

export default function ImageCapture({ onImageCapture, isLoading }: ImageCaptureProps) {
  const [mode, setMode] = useState<CaptureMode>("select");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = useCallback((): void => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (!screenshot) return;

    const file = dataURLtoFile(screenshot, `webcam-capture-${Date.now()}.jpg`);
    onImageCapture(file);
  }, [onImageCapture]);

  const processFile = useCallback(
    (file: File): void => {
      if (!file.type.startsWith("image/")) return;
      onImageCapture(file);
    },
    [onImageCapture],
  );

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>): void => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  const handleCancel = useCallback((): void => {
    setMode("select");
    setIsDragging(false);
  }, []);

  if (mode === "select") {
    return (
      <div className="flex flex-col items-center gap-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Show us your <span className="text-orange-400">face</span>
          </h2>
          <p className="mt-2 text-sm text-gray-500">We'll recommend games based on your mood</p>
        </div>

        <div className="flex gap-5">
          <button
            type="button"
            onClick={() => setMode("upload")}
            disabled={isLoading}
            className="group flex flex-col items-center gap-3 rounded-2xl border border-gray-700 bg-[#1e1e1e] px-10 py-8 transition hover:border-orange-500/60 hover:shadow-[0_0_20px_rgba(249,115,22,0.1)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <HiOutlineArrowUpTray className="h-10 w-10 text-gray-400 transition group-hover:text-orange-400" />
            <span className="text-lg font-medium">Upload Image</span>
          </button>

          <button
            type="button"
            onClick={() => setMode("webcam")}
            disabled={isLoading}
            className="group flex flex-col items-center gap-3 rounded-2xl border border-gray-700 bg-[#1e1e1e] px-10 py-8 transition hover:border-orange-500/60 hover:shadow-[0_0_20px_rgba(249,115,22,0.1)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <HiOutlineCamera className="h-10 w-10 text-gray-400 transition group-hover:text-orange-400" />
            <span className="text-lg font-medium">Use Webcam</span>
          </button>
        </div>
      </div>
    );
  }

  if (mode === "webcam") {
    return (
      <div className="flex flex-col items-center gap-4 p-6">
        <div className="overflow-hidden rounded-2xl border border-gray-700 shadow-lg">
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={WEBCAM_CONSTRAINTS}
            className="block"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleCapture}
            disabled={isLoading}
            className="rounded-lg bg-orange-500 px-6 py-2.5 font-medium text-white transition hover:bg-orange-600 hover:shadow-[0_0_16px_rgba(249,115,22,0.3)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Processing…" : "Capture Photo"}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="rounded-lg border border-gray-600 px-6 py-2.5 font-medium text-gray-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div
        role="button"
        tabIndex={0}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
        }}
        className={`flex w-full max-w-md cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed p-12 transition ${
          isDragging
            ? "border-orange-400 bg-orange-400/10"
            : "border-gray-600 hover:border-orange-400/60 hover:bg-orange-400/5"
        } ${isLoading ? "pointer-events-none opacity-50" : ""}`}
      >
        <HiOutlinePhoto className="h-12 w-12 text-gray-500" />

        <p className="text-lg font-medium">
          {isDragging ? "Drop your image here" : "Drag & drop an image or click to browse"}
        </p>
        <p className="text-sm text-gray-500">Supports JPG, PNG, GIF, WebP</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={handleCancel}
        disabled={isLoading}
        className="rounded-lg border border-gray-600 px-6 py-2.5 font-medium text-gray-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Cancel
      </button>
    </div>
  );
}
