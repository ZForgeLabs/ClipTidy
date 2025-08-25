"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Upload, FileVideo, Video, Settings, Download, Trash2, CheckCircle, Loader2, Crop, Move } from "lucide-react";

interface VideoFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  convertedBlob?: Blob;
  previewUrl?: string;
}

interface ConversionSettings {
  format: string;
  quality: string;
  fps: number;
  bitrate: number;
  autoCrop: boolean;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Video Preview Component
function VideoPreview({ file, autoCrop, onCropChange }: { 
  file: VideoFile; 
  autoCrop: boolean; 
  onCropChange: (crop: CropArea) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 100, height: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string>('');

  useEffect(() => {
    if (file.previewUrl && videoRef.current) {
      videoRef.current.src = file.previewUrl;
    }
  }, [file.previewUrl]);

  const handleMouseDown = (e: React.MouseEvent, handle?: string) => {
    if (!autoCrop) return;
    
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    if (handle) {
      setIsResizing(true);
      setResizeHandle(handle);
    } else {
      setIsDragging(true);
    }
    
    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!autoCrop || (!isDragging && !isResizing)) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    const deltaX = currentX - dragStart.x;
    const deltaY = currentY - dragStart.y;

    if (isDragging) {
      const newX = Math.max(0, Math.min(100 - cropArea.width, cropArea.x + (deltaX / rect.width) * 100));
      const newY = Math.max(0, Math.min(100 - cropArea.height, cropArea.y + (deltaY / rect.height) * 100));
      
      const newCropArea = { ...cropArea, x: newX, y: newY };
      setCropArea(newCropArea);
      onCropChange(newCropArea);
    } else if (isResizing) {
      let newCropArea = { ...cropArea };
      
      switch (resizeHandle) {
        case 'nw':
          newCropArea = {
            x: Math.max(0, cropArea.x + (deltaX / rect.width) * 100),
            y: Math.max(0, cropArea.y + (deltaY / rect.height) * 100),
            width: Math.max(20, cropArea.width - (deltaX / rect.width) * 100),
            height: Math.max(20, cropArea.height - (deltaY / rect.height) * 100)
          };
          break;
        case 'ne':
          newCropArea = {
            x: cropArea.x,
            y: Math.max(0, cropArea.y + (deltaY / rect.height) * 100),
            width: Math.max(20, cropArea.width + (deltaX / rect.width) * 100),
            height: Math.max(20, cropArea.height - (deltaY / rect.height) * 100)
          };
          break;
        case 'sw':
          newCropArea = {
            x: Math.max(0, cropArea.x + (deltaX / rect.width) * 100),
            y: cropArea.y,
            width: Math.max(20, cropArea.width - (deltaX / rect.width) * 100),
            height: Math.max(20, cropArea.height + (deltaY / rect.height) * 100)
          };
          break;
        case 'se':
          newCropArea = {
            x: cropArea.x,
            y: cropArea.y,
            width: Math.max(20, cropArea.width + (deltaX / rect.width) * 100),
            height: Math.max(20, cropArea.height + (deltaY / rect.height) * 100)
          };
          break;
      }
      
      setCropArea(newCropArea);
      onCropChange(newCropArea);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle('');
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove as any);
    
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove as any);
    };
  }, [isDragging, isResizing, cropArea, dragStart, resizeHandle]);

  if (!autoCrop || !file.previewUrl) {
    return null;
  }

  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-400/30">
            <Crop className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <CardTitle className="text-lg text-white">Video Preview & Crop</CardTitle>
            <CardDescription className="text-gray-400">
              Drag to move the crop area, drag corners to resize
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          ref={containerRef}
          className="relative w-full max-w-2xl mx-auto bg-black rounded-lg overflow-hidden cursor-move"
          style={{ aspectRatio: '16/9' }}
          onMouseDown={handleMouseDown}
        >
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            controls
            muted
            loop
          />
          
          {/* Crop Overlay */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(
                to right,
                rgba(0,0,0,0.5) 0%,
                rgba(0,0,0,0.5) ${cropArea.x}%,
                transparent ${cropArea.x}%,
                transparent ${cropArea.x + cropArea.width}%,
                rgba(0,0,0,0.5) ${cropArea.x + cropArea.width}%,
                rgba(0,0,0,0.5) 100%
              ),
              linear-gradient(
                to bottom,
                rgba(0,0,0,0.5) 0%,
                rgba(0,0,0,0.5) ${cropArea.y}%,
                transparent ${cropArea.y}%,
                transparent ${cropArea.y + cropArea.height}%,
                rgba(0,0,0,0.5) ${cropArea.y + cropArea.height}%,
                rgba(0,0,0,0.5) 100%
              )`
            }}
          />
          
          {/* Crop Border */}
          <div
            className="absolute border-2 border-blue-400 pointer-events-none"
            style={{
              left: `${cropArea.x}%`,
              top: `${cropArea.y}%`,
              width: `${cropArea.width}%`,
              height: `${cropArea.height}%`
            }}
          >
            {/* Corner Handles */}
            <div
              className="absolute w-3 h-3 bg-blue-400 rounded-full -top-1.5 -left-1.5 cursor-nw-resize pointer-events-auto"
              onMouseDown={(e) => handleMouseDown(e, 'nw')}
            />
            <div
              className="absolute w-3 h-3 bg-blue-400 rounded-full -top-1.5 -right-1.5 cursor-ne-resize pointer-events-auto"
              onMouseDown={(e) => handleMouseDown(e, 'ne')}
            />
            <div
              className="absolute w-3 h-3 bg-blue-400 rounded-full -bottom-1.5 -left-1.5 cursor-sw-resize pointer-events-auto"
              onMouseDown={(e) => handleMouseDown(e, 'sw')}
            />
            <div
              className="absolute w-3 h-3 bg-blue-400 rounded-full -bottom-1.5 -right-1.5 cursor-se-resize pointer-events-auto"
              onMouseDown={(e) => handleMouseDown(e, 'se')}
            />
          </div>
          
          {/* Crop Info */}
          <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
            Crop: {Math.round(cropArea.width)}% × {Math.round(cropArea.height)}%
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            The video will be cropped to the selected area and converted to vertical format
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function VideoUpload() {
  const [files, setFiles] = useState<VideoFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentCrop, setCurrentCrop] = useState<CropArea>({ x: 0, y: 0, width: 100, height: 100 });
  const { toast } = useToast();

  const [settings, setSettings] = useState<ConversionSettings>({
    format: 'mp4',
    quality: 'high',
    fps: 30,
    bitrate: 5000,
    autoCrop: true,
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFiles = (fileList: File[]) => {
    // Only take the first file for single file upload
    const file = fileList[0];
    
    // Accept all video file types
    const isVideo = file.type.startsWith('video/');
    const hasVideoExtension = /\.(mp4|mov|avi|mkv|wmv|flv|webm|m4v|3gp|ogv|ts|mts|m2ts)$/i.test(file.name);
    
    if (!isVideo && !hasVideoExtension) {
      toast({
        title: "Invalid file",
        description: "Please select a video file. Supported formats: MP4, MOV, AVI, MKV, WMV, FLV, WebM, M4V, 3GP, OGV, TS, MTS, M2TS",
        variant: "destructive",
      });
      return;
    }

    const newFile: VideoFile = {
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
      type: file.type || 'video/mp4',
      progress: 0,
      status: 'uploading',
      previewUrl: URL.createObjectURL(file), // Create preview URL for video player
    };

    setFiles([newFile]); // Replace any existing files with the new one
    
    // Only start conversion immediately if auto crop is disabled
    if (!settings.autoCrop) {
      startConversion([newFile]);
    }
  };

  const startConversion = async (videoFiles: VideoFile[]) => {
    setIsUploading(true);
    
    for (const videoFile of videoFiles) {
      try {
        // Update status to processing
        setFiles(prev => prev.map(f => 
          f.id === videoFile.id 
            ? { ...f, status: 'processing', progress: 0 }
            : f
        ));

        // Create a video element for processing
        const video = document.createElement('video');
        video.muted = true;
        video.crossOrigin = 'anonymous';
        
        // Create canvas for video processing
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          throw new Error('Canvas context not available');
        }

        // Set canvas to vertical format (9:16 aspect ratio)
        const targetWidth = 1080;
        const targetHeight = 1920;
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Load video and get metadata
        const videoLoaded = new Promise((resolve, reject) => {
          video.onloadedmetadata = () => resolve(true);
          video.onerror = () => reject(new Error('Failed to load video'));
        });

        video.src = URL.createObjectURL(videoFile.file);
        await videoLoaded;

        // Calculate scaling parameters with crop settings
        const videoAspectRatio = video.videoWidth / video.videoHeight;
        const canvasAspectRatio = targetWidth / targetHeight;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (settings.autoCrop) {
          // Apply user-defined crop area
          const cropX = (currentCrop.x / 100) * video.videoWidth;
          const cropY = (currentCrop.y / 100) * video.videoHeight;
          const cropWidth = (currentCrop.width / 100) * video.videoWidth;
          const cropHeight = (currentCrop.height / 100) * video.videoHeight;
          
          // Scale the cropped area to fit the target canvas
          const cropAspectRatio = cropWidth / cropHeight;
          
          if (cropAspectRatio > canvasAspectRatio) {
            // Cropped area is wider than target - fit to height
            drawHeight = targetHeight;
            drawWidth = targetHeight * cropAspectRatio;
            offsetX = (targetWidth - drawWidth) / 2;
            offsetY = 0;
          } else {
            // Cropped area is taller than target - fit to width
            drawWidth = targetWidth;
            drawHeight = targetWidth / cropAspectRatio;
            offsetX = 0;
            offsetY = (targetHeight - drawHeight) / 2;
          }
        } else {
          // Original auto-crop logic
          if (videoAspectRatio > canvasAspectRatio) {
            // Video is wider than target - fit to height, crop width
            drawHeight = targetHeight;
            drawWidth = targetHeight * videoAspectRatio;
            offsetX = (targetWidth - drawWidth) / 2;
            offsetY = 0;
          } else {
            // Video is taller than target - fit to width, crop height
            drawWidth = targetWidth;
            drawHeight = targetWidth / videoAspectRatio;
            offsetX = 0;
            offsetY = (targetHeight - drawHeight) / 2;
          }
        }

        // Simulate frame processing with progress updates
        const totalFrames = Math.floor(video.duration * 30); // Assume 30 FPS
        let processedFrames = 0;

        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 200));
          processedFrames = Math.floor((i / 100) * totalFrames);
          
          setFiles(prev => prev.map(f => 
            f.id === videoFile.id 
              ? { ...f, progress: i }
              : f
          ));
        }

        // Create a MediaRecorder to capture the processed video
        const stream = canvas.captureStream(30); // 30 FPS
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: `video/${settings.format === 'mp4' ? 'webm' : settings.format}`
        });

        const chunks: Blob[] = [];
        
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const convertedBlob = new Blob(chunks, { type: `video/${settings.format}` });
          
          // Update file with converted blob
          setFiles(prev => prev.map(f => 
            f.id === videoFile.id 
              ? { 
                  ...f, 
                  status: 'completed', 
                  progress: 100,
                  convertedBlob: convertedBlob
                }
              : f
          ));

          toast({
            title: "Conversion completed!",
            description: `${videoFile.name} has been converted to vertical format (${targetWidth}x${targetHeight}).`,
          });
        };

        // Start recording
        mediaRecorder.start();

        // Process video frames
        video.currentTime = 0;
        video.play();

        const processFrame = () => {
          if (video.currentTime < video.duration) {
            // Fill canvas with black background
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, targetWidth, targetHeight);

            if (settings.autoCrop) {
              // Draw the cropped video frame
              const cropX = (currentCrop.x / 100) * video.videoWidth;
              const cropY = (currentCrop.y / 100) * video.videoHeight;
              const cropWidth = (currentCrop.width / 100) * video.videoWidth;
              const cropHeight = (currentCrop.height / 100) * video.videoHeight;
              
              ctx.drawImage(
                video,
                cropX, cropY, cropWidth, cropHeight, // Source rectangle (crop area)
                offsetX, offsetY, drawWidth, drawHeight // Destination rectangle
              );
            } else {
              // Draw the current video frame (original logic)
              ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);
            }

            // Continue to next frame
            video.currentTime += 1/30; // 30 FPS
            requestAnimationFrame(processFrame);
          } else {
            // Stop recording when done
            mediaRecorder.stop();
            video.pause();
          }
        };

        video.onseeked = () => {
          requestAnimationFrame(processFrame);
        };

        // Start processing
        processFrame();

      } catch (error) {
        console.error('Conversion error:', error);
        setFiles(prev => prev.map(f => 
          f.id === videoFile.id 
            ? { ...f, status: 'error', progress: 0 }
            : f
        ));

        toast({
          title: "Conversion failed",
          description: "There was an error converting your video. Please try again.",
          variant: "destructive",
        });
      }
    }
    
    setIsUploading(false);
  };

  const handleDownload = async (file: VideoFile) => {
    if (!file.convertedBlob) {
      toast({
        title: "Download failed",
        description: "Converted file not found. Please try converting again.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create download link for the converted file
      const url = URL.createObjectURL(file.convertedBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${file.name.replace(/\.[^/.]+$/, '')}_vertical_1080x1920.${settings.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      URL.revokeObjectURL(url);

      toast({
        title: "Download started!",
        description: `${file.name} has been converted to vertical format (1080x1920) and is downloading.`,
      });

    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "There was an error downloading your video. Please try again.",
        variant: "destructive",
      });
    }
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 text-purple-400 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'error':
        return <div className="h-4 w-4 text-red-400">⚠</div>;
      default:
        return <Video className="h-4 w-4 text-blue-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploading':
        return 'text-blue-400';
      case 'processing':
        return 'text-purple-400';
      case 'completed':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className="border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl">
        <CardContent className="p-8">
          {files.length === 0 ? (
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                dragActive
                  ? "border-blue-400 bg-blue-500/10"
                  : "border-white/20 hover:border-white/40"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-white/20">
                  <Upload className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Drop your video file here
                  </h3>
                  <p className="text-gray-400 mb-4">
                    or click to browse your file
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Supports: MP4, MOV, AVI, MKV, WMV, FLV, WebM, M4V, 3GP, OGV, TS, MTS, M2TS
                  </p>
                  <p className="text-sm text-blue-400 mb-4">
                    ✨ Videos will be converted to vertical format (9:16) for mobile
                  </p>
                  <Button
                    onClick={() => document.getElementById('file-upload')?.click()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    disabled={isUploading}
                  >
                    <FileVideo className="mr-2 h-4 w-4" />
                    {isUploading ? 'Uploading...' : 'Choose Video File'}
                  </Button>
                </div>
              </div>
              <input
                id="file-upload"
                type="file"
                accept="video/*,.mp4,.mov,.avi,.mkv,.wmv,.flv,.webm,.m4v,.3gp,.ogv,.ts,.mts,.m2ts"
                className="hidden"
                onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
              />
            </div>
          ) : (
            <div className="space-y-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className={`p-6 rounded-xl border transition-all duration-300 ${
                    file.status === 'completed' 
                      ? 'border-green-500/20 bg-green-500/5' 
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg border ${
                        file.status === 'completed'
                          ? 'bg-green-500/20 border-green-400/30'
                          : 'bg-blue-500/20 border-blue-400/30'
                      }`}>
                        {file.status === 'completed' ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : (
                          <Video className="h-4 w-4 text-blue-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">{file.name}</p>
                        <p className="text-sm text-gray-400">
                          {formatFileSize(file.size)} • {file.type.split('/')[1]?.toUpperCase() || 'VIDEO'}
                        </p>
                        {file.status === 'completed' && (
                          <p className="text-xs text-green-400">
                            Vertical (9:16) • Perfect for mobile screens
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {file.status === 'completed' ? (
                        <div className="flex items-center gap-2">
                          <Button 
                            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                            onClick={() => handleDownload(file)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(file.status)}
                            <span className={`text-sm ${getStatusColor(file.status)}`}>
                              {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
                            </span>
                          </div>
                          
                          {file.status === 'processing' && (
                            <Progress value={file.progress} className="w-20" />
                          )}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conversion Settings */}
      <Card className="border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-400/30">
              <Settings className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-xl text-white">Conversion Settings</CardTitle>
              <CardDescription className="text-gray-400">
                Configure your video conversion preferences
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="format" className="text-sm font-medium text-gray-300">Output Format</Label>
              <Select value={settings.format} onValueChange={(value: any) => setSettings(prev => ({ ...prev, format: value }))}>
                <SelectTrigger className="w-full bg-white/5 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/10">
                  <SelectItem value="mp4">MP4</SelectItem>
                  <SelectItem value="mov">MOV</SelectItem>
                  <SelectItem value="avi">AVI</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quality" className="text-sm font-medium text-gray-300">Quality</Label>
              <Select value={settings.quality} onValueChange={(value: any) => setSettings(prev => ({ ...prev, quality: value }))}>
                <SelectTrigger className="w-full bg-white/5 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/10">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="ultra">Ultra</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-300">Frame Rate: {settings.fps} FPS</Label>
              <Slider
                value={[settings.fps]}
                onValueChange={(value) => setSettings(prev => ({ ...prev, fps: value[0] }))}
                max={60}
                min={24}
                step={1}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-300">Bitrate: {settings.bitrate} kbps</Label>
              <Slider
                value={[settings.bitrate]}
                onValueChange={(value) => setSettings(prev => ({ ...prev, bitrate: value[0] }))}
                max={10000}
                min={1000}
                step={500}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5">
            <div className="space-y-1">
              <Label htmlFor="auto-crop" className="text-sm font-medium text-gray-300">Auto Crop</Label>
              <p className="text-sm text-gray-400">
                {settings.autoCrop ? "Manual crop preview enabled - drag to adjust crop area" : "Automatically detect and crop black bars"}
              </p>
            </div>
            <Switch
              id="auto-crop"
              checked={settings.autoCrop}
              onCheckedChange={(checked) => {
                setSettings(prev => ({ ...prev, autoCrop: checked }));
                // If enabling auto crop and we have a file, update its status to allow manual conversion
                if (checked && files.length > 0) {
                  setFiles(prev => prev.map(f => ({ ...f, status: 'uploading' as const })));
                }
              }}
            />
          </div>
          
          {/* Manual Conversion Button for Auto Crop */}
          {settings.autoCrop && files.length > 0 && files[0].status === 'uploading' && (
            <div className="flex justify-center">
              <Button 
                onClick={() => startConversion(files)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <Video className="h-4 w-4 mr-2" />
                    Convert with Crop Settings
                  </>
                )}
              </Button>
            </div>
          )}
          

        </CardContent>
      </Card>

      {/* Video Preview */}
      {settings.autoCrop && files.length > 0 && files[0].previewUrl && (
        <VideoPreview 
          file={files[0]} 
          autoCrop={settings.autoCrop} 
          onCropChange={setCurrentCrop}
        />
      )}
    </div>
  );
}
