"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { analyzeImage } from "@/server/analyze-image";
import NextImage from "next/image";
import { useState } from "react";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [critique, setCritique] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const downsampleImage = (
    imageData: string,
    maxWidth: number = 800
  ): Promise<string> => {
    return new Promise((resolve) => {
      const img = document.createElement("img");
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.8).split(",")[1]); // Get just the base64 string without data URL prefix
      };
      img.src = imageData;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageData = reader.result as string;
        const downsampledImage = await downsampleImage(imageData);
        setSelectedImage(downsampledImage);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateCritique = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    setCritique("");
    try {
      const result = await analyzeImage(selectedImage);
      setCritique(result);
    } catch (error) {
      setCritique("Failed to generate critique");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl">
        <h1 className="text-3xl font-extrabold text-center text-indigo-600 mb-4">
          Art Critique AI
        </h1>
        <p className="text-center text-gray-700 mb-8">
          Upload your artwork and receive an AI-generated critique to improve
          your skills.
        </p>
        <div className="flex flex-col items-center mb-8">
          {selectedImage ? (
            <>
              <div className="relative w-96 h-96 mb-4 group">
                <Button
                  onClick={() => setSelectedImage(null)}
                  variant="ghost"
                  className="absolute right-2 top-2 z-10 h-8 w-8 rounded-full bg-red-400 p-0 hover:bg-red-400/50 shadow-md text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </Button>
                <NextImage
                  src={`data:image/jpeg;base64,${selectedImage}`}
                  alt="Uploaded artwork"
                  layout="fill"
                  objectFit="contain"
                  className="rounded-lg shadow-lg"
                />
              </div>
            </>
          ) : (
            <div className="w-full max-w-md">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors">
                <Label
                  htmlFor="image"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-gray-600">Click to upload artwork</span>
                  <span className="text-sm text-gray-500">
                    or drag and drop
                  </span>
                </Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>
          )}
        </div>

        <Button
          onClick={generateCritique}
          disabled={!selectedImage || isLoading}
          className="w-full bg-indigo-600 text-white hover:bg-indigo-700 mb-6"
        >
          {isLoading ? "Analyzing..." : "Generate Critique"}
        </Button>

        {critique && (
          <div className="bg-gray-50 p-4 rounded-md shadow-inner">
            <Label className="block text-gray-700 mb-2">AI Critique</Label>
            <Textarea
              value={critique}
              readOnly
              className="w-full h-40 p-2 border border-gray-300 rounded-md resize-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}
