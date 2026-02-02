import { useState, useEffect, useCallback } from "react";

type LoadedImage = {
	src: string;
	name: string;
};

export default function GalleryContent() {
	const [images, setImages] = useState<LoadedImage[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

	useEffect(() => {
		fetch("/gallery.txt")
			.then((res) => {
				if (!res.ok) throw new Error("Failed to load gallery");
				return res.text();
			})
			.then((text) => {
				const paths = text
					.split("\n")
					.map((line) => line.trim())
					.filter((line) => line);

				const loadedImages = paths.map((path) => {
					const filename = path.split("/").pop() || "";
					const name = filename.replace(/\.[^/.]+$/, "");
					return { src: path, name };
				});

				setImages(loadedImages);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message);
				setLoading(false);
			});
	}, []);

	const handlePrev = useCallback(() => {
		setSelectedIndex((current) => {
			if (current === null) return null;
			return current > 0 ? current - 1 : images.length - 1;
		});
	}, [images.length]);

	const handleNext = useCallback(() => {
		setSelectedIndex((current) => {
			if (current === null) return null;
			return current < images.length - 1 ? current + 1 : 0;
		});
	}, [images.length]);

	const handleClose = useCallback(() => {
		setSelectedIndex(null);
	}, []);

	// Keyboard navigation
	useEffect(() => {
		if (selectedIndex === null) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "ArrowLeft") handlePrev();
			else if (e.key === "ArrowRight") handleNext();
			else if (e.key === "Escape") handleClose();
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [selectedIndex, handlePrev, handleNext, handleClose]);

	if (error) {
		return (
			<div className="gallery-empty">
				<p>Error loading gallery</p>
				<p className="gallery-empty-hint">{error}</p>
			</div>
		);
	}

	if (loading) {
		return (
			<div className="gallery-loading">
				<div className="gallery-loading-text">Loading gallery...</div>
			</div>
		);
	}

	if (images.length === 0) {
		return (
			<div className="gallery-empty">
				<p>No images in gallery</p>
			</div>
		);
	}

	const selectedImage = selectedIndex !== null ? images[selectedIndex] : null;

	return (
		<div className="gallery-container">
			<div className="gallery-status">{images.length} images</div>

			<div className="gallery-grid">
				{images.map((img, i) => (
					<button
						key={i}
						type="button"
						className="gallery-thumbnail"
						onClick={() => setSelectedIndex(i)}
						title={img.name}
					>
						<img src={img.src} alt={img.name} loading="lazy" />
					</button>
				))}
			</div>

			{selectedImage && selectedIndex !== null && (
				<div className="gallery-lightbox">
					{/* Fixed header */}
					<div className="gallery-lightbox-header">
						<div className="gallery-lightbox-title">
							{selectedImage.name}
						</div>
					</div>

					<div
						className="gallery-lightbox-image-container"
						onClick={handleClose}
					>
						<img
							src={selectedImage.src}
							alt={selectedImage.name}
							onClick={(e) => e.stopPropagation()}
						/>
					</div>

					<div className="gallery-lightbox-footer">
						<div className="gallery-lightbox-nav">
							<button type="button" onClick={handlePrev}>
								◀ Prev
							</button>
							<span className="gallery-lightbox-counter">
								{selectedIndex + 1} / {images.length}
							</span>
							<button type="button" onClick={handleNext}>
								Next ▶
							</button>
							<button type="button" onClick={handleClose}>
								✕ Close
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
