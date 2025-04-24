const ImageZoomModal = ({ image, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80  z-52 flex items-center justify-center">
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-white cursor-pointer text-black rounded-full px-3 py-1 text-sm font-bold z-10"
        >
          ✕
        </button>
        <img
          src={image}
          alt="Zoom"
          className="max-w-full max-h-[90vh] object-contain rounded-xl"
        />
      </div>
    </div>
  );
};

export default ImageZoomModal;
