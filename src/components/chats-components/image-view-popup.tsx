import { X, Download } from "lucide-react";

type PropsType = {
    showImageView: boolean;
    setShowImageView: React.Dispatch<React.SetStateAction<boolean>>;
    imageViewUrl: string;
    setImageViewUrl: React.Dispatch<React.SetStateAction<string | null>>;
};

const ImageViewPopup = ({
    showImageView,
    imageViewUrl,
    setShowImageView,
    setImageViewUrl,
}: PropsType) => {
    const handleClose = () => {
        setShowImageView(false);
        setImageViewUrl(null);
    };

    const handleDownload = async () => {
        try {
            const res = await fetch(imageViewUrl);
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            const fileName = imageViewUrl.split("/").pop() || "image.jpg";
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Image download failed:", err);
        }
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
                showImageView ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={handleClose}
        >
            <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition"
            >
                <X size={28} />
            </button>

            <div
                className={`relative max-w-[90vw] max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl transform transition-all duration-500 ${
                    showImageView ? "scale-100" : "scale-95 opacity-0"
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={imageViewUrl}
                    alt="Preview"
                    className="rounded-2xl object-contain w-full h-full"
                />

                <button
                    onClick={handleDownload}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <div className="bg-black/50 hover:bg-black/70 text-white p-4 rounded-full backdrop-blur-md transition transform hover:scale-110">
                        <Download size={32} />
                    </div>
                </button>
            </div>
        </div>
    );
};

export default ImageViewPopup;
