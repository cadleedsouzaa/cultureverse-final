import { useState, useRef, useCallback, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Sparkles, Eye, Archive, Camera, Image as ImageIcon, X, Repeat } from "lucide-react";
import Webcam  from "react-webcam";

export default function Index() {
  // State to hold the selected image file
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  // State to manage if camera view is active
  const [showCamera, setShowCamera] = useState(false);
  // State to show image preview URL
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Refs for hidden input and webcam controller
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);

  // --- Handlers for File Upload ---

  // Trigger hidden file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection change
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // --- Handlers for Camera ---

  // Capture photo from webcam
  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
        // Convert base64 data URL to a File object
        fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
            const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
            processFile(file);
            setShowCamera(false); // Turn off camera view after capture
        });
    }
  }, [webcamRef]);

  // Common function to process loaded file and set preview
  const processFile = (file: File) => {
    setSelectedImage(file);
    // Create a temporary URL for previewing the image
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  // Reset state to start over
  const clearSelection = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setShowCamera(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };


  return (
    <div className="h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 flex flex-col overflow-hidden">
      {/* Hidden Input for File Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/jpg"
        className="hidden"
      />

      {/* Header */}
      <header className="flex items-center justify-between px-8 py-3 border-b border-border/30 flex-shrink-0">
        <div className="text-lg font-semibold tracking-wide text-foreground font-serif">
          CultureVerse Lens
        </div>
        <nav className="flex items-center gap-6 text-xs text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">
            Demo
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Archive
          </a>
        </nav>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-between px-6 py-8 overflow-auto">
        {/* Hero Section */}
        <div className="text-center max-w-4xl flex-shrink-0 mb-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-3 tracking-wide">
            CultureVerse Lens
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-light tracking-wide">
            AI + AR platform that brings local crafts and traditions to life.
          </p>
        </div>

        {/* CENTERED Functional Card */}
        <div className="w-full max-w-xl flex-shrink-0 mb-auto">
          <div className="glass soft-shadow w-full rounded-2xl p-8 backdrop-blur-lg bg-white/40 border border-white/60 shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-serif font-semibold text-foreground mb-6 text-center">
              Upload or Scan
            </h2>

            {/* CONDITIONAL RENDERING BASED ON STATE */}

            {showCamera ? (
              // --- VIEW 1: CAMERA ACTIVE ---
              // --- VIEW 1: CAMERA ACTIVE ---
              <div className="mb-6 flex flex-col items-center">
                <div className="rounded-xl overflow-hidden border-2 border-amber-500 shadow-lg mb-4 w-full h-64 bg-black relative flex items-center justify-center">
                    {/* MAKE SURE THIS PART LOOKS EXACTLY LIKE THIS */}

                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        // Prefer rear camera on phones
                        videoConstraints={{ facingMode: "environment" }}
                        // Inline styles for reliable sizing. NO className here!
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                </div>
                <div className="flex gap-3 w-full">
                    <Button variant="outline" className="flex-1" onClick={() => setShowCamera(false)}>Cancel</Button>
                    <Button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white" onClick={capturePhoto}>
                        <Camera className="w-4 h-4 mr-2" /> Capture
                    </Button>
                </div>
              </div>

            ) : previewUrl ? (
               // --- VIEW 2: IMAGE SELECTED (PREVIEW) ---
               <div className="mb-6 relative rounded-xl overflow-hidden border-2 border-border/50 bg-secondary/30 h-64 flex items-center justify-center group">
                  <img src={previewUrl} alt="Selected" className="w-full h-full object-contain" />
                  {/* Overlay to remove/change */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                       <Button size="sm" variant="destructive" onClick={clearSelection}>
                           <X className="w-4 h-4 mr-1" /> Remove
                       </Button>
                  </div>
               </div>

            ) : (
              // --- VIEW 3: INITIAL SELECTION STATE ---
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Left Side - Drop Image */}
                <div
                  onClick={handleUploadClick}
                  className="border-2 border-dashed border-muted rounded-xl p-4 bg-secondary/30 flex flex-col items-center justify-center h-48 transition-all hover:bg-secondary/50 hover:border-amber-400/50 cursor-pointer group"
                >
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <ImageIcon
                      className="w-6 h-6 text-amber-600"
                      strokeWidth={1.5}
                    />
                  </div>
                  <p className="text-sm text-foreground font-medium">
                    Upload Image
                  </p>
                  <p className="text-xs text-muted-foreground text-center mt-1">
                    JPG, PNG or JPEG
                  </p>
                </div>

                {/* Right Side - Use Camera */}
                <div
                  onClick={() => setShowCamera(true)}
                  className="border-2 border-dashed border-muted rounded-xl p-4 bg-secondary/30 flex flex-col items-center justify-center h-48 transition-all hover:bg-secondary/50 hover:border-amber-400/50 cursor-pointer group"
                >
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Camera
                      className="w-6 h-6 text-amber-600"
                      strokeWidth={1.5}
                    />
                  </div>
                  <p className="text-sm text-foreground font-medium">
                    Use Camera
                  </p>
                  <p className="text-xs text-muted-foreground text-center mt-1">
                    Take a photo
                  </p>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="space-y-3">
              <Button
                // Dynamic styling based on if image is selected
                className={`w-full font-semibold py-3 text-base rounded-xl transition-all duration-200 ${
                  selectedImage
                    ? "bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white hover:shadow-lg hover:scale-[1.02]"
                    : "bg-muted text-muted-foreground opacity-70 cursor-not-allowed"
                }`}
                size="lg"
                // Disable if no image selected OR if camera is currently open
                disabled={!selectedImage || showCamera}
                onClick={() => {
                    if(selectedImage) {
                        console.log("Ready to send to backend:", selectedImage);
                        alert("Ready to identify! Check console for file info.");
                        // FUTURE: Add API call here
                    }
                }}
              >
                Identify Craft
              </Button>
              {!showCamera && !selectedImage && (
                 <Button
                 variant="ghost"
                 className="w-full border border-foreground/20 text-foreground hover:bg-foreground/5 py-3 text-base rounded-xl font-medium transition-all duration-200"
                 size="lg"
               >
                 Try Demo
               </Button>
              )}
             {selectedImage && !showCamera && (
                  <Button variant="ghost" size="sm" onClick={clearSelection} className="w-full text-muted-foreground hover:text-destructive">
                      <Repeat className="w-3 h-3 mr-1" /> Start Over
                  </Button>
             )}
            </div>

            {/* Helper Text */}
            {!showCamera && !selectedImage && (
                <p className="text-xs text-muted-foreground text-center mt-4 font-light tracking-tight">
                AI-powered cultural recognition • No signup required
                </p>
            )}
          </div>
        </div>

        {/* Features Row */}
        <div className="grid grid-cols-3 gap-8 w-full max-w-3xl flex-shrink-0 mt-8 pb-8">
          {/* Feature 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6 text-amber-600" strokeWidth={1.5} />
            </div>
            <p className="text-sm font-medium text-foreground">
              AI Recognition
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-3">
              <Eye className="w-6 h-6 text-amber-600" strokeWidth={1.5} />
            </div>
            <p className="text-sm font-medium text-foreground">
              AR Story Overlay
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-3">
              <Archive className="w-6 h-6 text-amber-600" strokeWidth={1.5} />
            </div>
            <p className="text-sm font-medium text-foreground">
              Community Archive
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}