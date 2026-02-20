import { useEffect, useCallback, useState } from "react";

type GalleryItem = {
	id: string;
	original: string;
	thumb: { avif: string; webp: string };
	mid: { avif: string; webp: string };
};

function withBaseUrl(p: string) {
	const base = import.meta.env.BASE_URL;
	return base + (p.startsWith("/") ? p.slice(1) : p);
}

export default function GalleryContent() {
	const [images, setImages] = useState<GalleryItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

	useEffect(() => {
		fetch(withBaseUrl("gallery.json"))
			.then((res) => {
				if (!res.ok) throw new Error("Failed to load gallery.json");
				return res.json() as Promise<GalleryItem[]>;
			})
			.then(setImages)
			.catch((err: unknown) => setError(err instanceof Error ? err.message : String(err)))
			.finally(() => setLoading(false));
	}, []);

	const handlePrev = useCallback(() => {
		setSelectedIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
	}, [images.length]);

	const handleNext = useCallback(() => {
		setSelectedIndex((i) => (i === null ? null : (i + 1) % images.length));
	}, [images.length]);

	useEffect(() => {
		if (selectedIndex === null) return;
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "ArrowLeft") handlePrev();
			if (e.key === "ArrowRight") handleNext();
			if (e.key === "Escape") setSelectedIndex(null);
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [selectedIndex, handlePrev, handleNext]);

	useEffect(() => {
		if (selectedIndex === null || images.length < 2) return;
		const neighbors = [
			images[(selectedIndex + 1) % images.length],
			images[(selectedIndex - 1 + images.length) % images.length],
		];
		const links = neighbors.map((item) => {
			const link = document.createElement("link");
			link.rel = "preload";
			link.as = "image";
			link.href = withBaseUrl(item.mid.webp);
			document.head.appendChild(link);
			return link;
		});
		return () => { links.forEach((l) => l.parentNode?.removeChild(l)); };
	}, [selectedIndex, images]);

	if (error) return <div className="gallery-empty"><p>Error loading gallery</p><p className="gallery-empty-hint">{error}</p></div>;
	if (loading) return <div className="gallery-loading"><div className="gallery-loading-text">Loading gallery...</div></div>;
	if (!images.length) return <div className="gallery-empty"><p>No images in gallery</p></div>;

	const selectedImage = selectedIndex !== null ? images[selectedIndex] : null;

	return (
		<div className="gallery-container">
			<div className="gallery-status">{images.length} images</div>

			<div className="gallery-grid">
				{images.map((img, i) => (
					<button
						key={img.id}
						type="button"
						className="gallery-thumbnail"
						onClick={() => setSelectedIndex(i)}
						title={img.id}
					>
						<picture>
							<source srcSet={withBaseUrl(img.thumb.avif)} type="image/avif" />
							<source srcSet={withBaseUrl(img.thumb.webp)} type="image/webp" />
							<img src={withBaseUrl(img.thumb.webp)} alt={img.id} loading="lazy" decoding="async" width={320} height={320} />
						</picture>
					</button>
				))}
			</div>

			{selectedImage && selectedIndex !== null && (
				<div className="gallery-lightbox">
					<div className="gallery-lightbox-header">
						<div className="gallery-lightbox-title">{selectedImage.id}</div>
					</div>

					<div className="gallery-lightbox-image-container" onClick={() => setSelectedIndex(null)}>
						<picture>
							<source srcSet={withBaseUrl(selectedImage.mid.avif)} type="image/avif" />
							<source srcSet={withBaseUrl(selectedImage.mid.webp)} type="image/webp" />
							<img
								src={withBaseUrl(selectedImage.mid.webp)}
								alt={selectedImage.id}
								decoding="async"
								onClick={(e) => e.stopPropagation()}
							/>
						</picture>
					</div>

					<div className="gallery-lightbox-footer">
						<div className="gallery-lightbox-nav">
							<button type="button" onClick={handlePrev}>◀ Prev</button>
							<span className="gallery-lightbox-counter">{selectedIndex + 1} / {images.length}</span>
							<button type="button" onClick={handleNext}>Next ▶</button>
							<button type="button" onClick={() => setSelectedIndex(null)}>✕ Close</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
