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
      <div className="flex flex-col items-center gap-6 p-8">
        <h2 className="text-2xl font-semibold">How would you like to provide an image?</h2>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setMode("upload")}
            disabled={isLoading}
            className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-gray-500 px-8 py-6 transition hover:border-indigo-400 hover:bg-indigo-400/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <HiOutlineArrowUpTray className="h-10 w-10" />
            <span className="text-lg font-medium">Upload Image</span>
          </button>

          <button
            type="button"
            onClick={() => setMode("webcam")}
            disabled={isLoading}
            className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-gray-500 px-8 py-6 transition hover:border-indigo-400 hover:bg-indigo-400/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <HiOutlineCamera className="h-10 w-10" />
            <span className="text-lg font-medium">Use Webcam</span>
          </button>
        </div>
      </div>
    );
  }

  if (mode === "webcam") {
    return (
      <div className="flex flex-col items-center gap-4 p-6">
        <div className="overflow-hidden rounded-xl border border-gray-600">
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
            className="rounded-lg bg-indigo-500 px-6 py-2 font-medium text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Processing…" : "Capture Photo"}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="rounded-lg border border-gray-500 px-6 py-2 font-medium transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
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
        className={`flex w-full max-w-md cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed p-12 transition ${
          isDragging
            ? "border-indigo-400 bg-indigo-400/10"
            : "border-gray-500 hover:border-indigo-400 hover:bg-indigo-400/5"
        } ${isLoading ? "pointer-events-none opacity-50" : ""}`}
      >
        <HiOutlinePhoto className="h-12 w-12 text-gray-400" />

        <p className="text-lg font-medium">
          {isDragging ? "Drop your image here" : "Drag & drop an image or click to browse"}
        </p>
        <p className="text-sm text-gray-400">Supports JPG, PNG, GIF, WebP</p>
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
        className="rounded-lg border border-gray-500 px-6 py-2 font-medium transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Cancel
      </button>
    </div>
  );
}
