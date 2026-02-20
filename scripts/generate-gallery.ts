import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const BASE_DIR = "public/images";
const THUMB_DIR = path.join(BASE_DIR, "thumb");
const MID_DIR = path.join(BASE_DIR, "mid");

type GalleryItem = {
	id: string;
	original: string;
	thumb: { avif: string; webp: string };
	mid: { avif: string; webp: string };
};

const SIZES = {
	thumb: { width: 320, avifQuality: 45, webpQuality: 65 },
	mid: { width: 1280, avifQuality: 55, webpQuality: 75 },
} as const;

function isImage(file: string) {
	return /\.(jpe?g|png)$/i.test(file);
}

async function processVariant(
	pipeline: sharp.Sharp,
	outDir: string,
	id: string,
	width: number,
	avifQuality: number,
	webpQuality: number,
): Promise<{ avif: string; webp: string }> {
	const resized = pipeline.resize({ width, withoutEnlargement: true });
	const avifPath = `images/${outDir}/${id}-${width}.avif`;
	const webpPath = `images/${outDir}/${id}-${width}.webp`;

	await Promise.all([
		resized.clone().avif({ quality: avifQuality }).toFile(path.join("public", avifPath)),
		resized.clone().webp({ quality: webpQuality }).toFile(path.join("public", webpPath)),
	]);

	return { avif: avifPath, webp: webpPath };
}

async function processImage(file: string): Promise<GalleryItem> {
	const id = file.replace(/\.[^/.]+$/, "");
	const pipeline = sharp(path.join(BASE_DIR, file));

	const [thumb, mid] = await Promise.all([
		processVariant(pipeline, "thumb", id, SIZES.thumb.width, SIZES.thumb.avifQuality, SIZES.thumb.webpQuality),
		processVariant(pipeline, "mid", id, SIZES.mid.width, SIZES.mid.avifQuality, SIZES.mid.webpQuality),
	]);

	return { id, original: `images/${file}`, thumb, mid };
}

async function main() {
	await Promise.all([
		fs.mkdir(THUMB_DIR, { recursive: true }),
		fs.mkdir(MID_DIR, { recursive: true }),
	]);

	const files = (await fs.readdir(BASE_DIR)).filter(isImage);

	const manifest = await Promise.all(
		files.map((file) => {
			console.log(`Processing ${file}`);
			return processImage(file);
		})
	);

	await fs.writeFile("public/gallery.json", JSON.stringify(manifest, null, 2));
	console.log(`Done. Processed ${manifest.length} images.`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
