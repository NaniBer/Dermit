import { useState, useEffect, useCallback } from "react";

const ImageViewer = ({ images }: { images: string[] }) => {
  // State to track the index of the selected image. null means no image is selected.
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // --- Navigation Logic ---

  const handleClose = () => {
    setSelectedIndex(null);
  };

  const handlePrev = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation(); // Prevent modal from closing
      if (selectedIndex === null) return;
      // Loop to the last image if at the beginning
      const prevIndex = (selectedIndex - 1 + images.length) % images.length;
      setSelectedIndex(prevIndex);
    },
    [selectedIndex, images.length]
  );

  const handleNext = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation(); // Prevent modal from closing
      if (selectedIndex === null) return;
      // Loop to the first image if at the end
      const nextIndex = (selectedIndex + 1) % images.length;
      setSelectedIndex(nextIndex);
    },
    [selectedIndex, images.length]
  );

  // --- Keyboard Event Listener ---

  useEffect(() => {
    // Only add listener if a modal is open
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup function to remove the listener when the modal closes or component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, handlePrev, handleNext]); // Re-run effect if index or functions change

  const isOpen = selectedIndex !== null;

  return (
    <>
      {/* --- Image Grid --- */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {images.map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt={`Consultation Image ${idx + 1}`}
            className="h-auto w-full cursor-zoom-in rounded-lg object-cover shadow-md transition-transform duration-200 hover:scale-105"
            onClick={() => setSelectedIndex(idx)}
          />
        ))}
      </div>

      {/* --- Modal for Zoomed-in Image --- */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          onClick={handleClose}
        >
          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/75"
            aria-label="Previous image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Image */}
          <div className="relative max-h-[90vh] max-w-[80vw]">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-2xl font-bold text-gray-800 shadow-lg transition-transform hover:scale-110"
              aria-label="Close image view"
            >
              &times;
            </button>
            <img
              src={images[selectedIndex]}
              alt={`Zoomed In Consultation Image ${selectedIndex + 1}`}
              className="h-auto w-full rounded-lg object-contain shadow-xl"
              onClick={(e) => e.stopPropagation()} // Prevent closing modal
            />
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/75"
            aria-label="Next image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}
    </>
  );
};

export default ImageViewer;
