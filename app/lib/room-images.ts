import ecoPhotoManifest from "./eco-photo-manifest.json";
import doublePhotoManifest from "./double-photo-manifest.json";
import triplePhotoManifest from "./triple-photo-manifest.json";
import familyPhotoManifest from "./family-photo-manifest.json";

export type RoomPhoto = {
  src: string;
  width: number;
  height: number;
  srcSet?: string;
  thumbnailSrc?: string;
  fullSrc?: string;
  fullWidth?: number;
  fullHeight?: number;
};

function roomPhoto(manifest: typeof ecoPhotoManifest, number: number) {
  const photo = manifest.find((item) => item.number === number);
  if (!photo) throw new Error(`Missing room photo metadata: ${number}`);
  const { variants, full } = photo;
  return {
    ...variants[variants.length - 1],
    srcSet: variants.map((variant) => `${variant.src} ${variant.width}w`).join(", "),
    thumbnailSrc: variants[0].src,
    fullSrc: full.src,
    fullWidth: full.width,
    fullHeight: full.height,
  };
}

// Lead with the bed and room views, followed by amenities and bathroom photos.
export const ecoRoomPhotos = [10, 2, 7, 8, 6, 9, 5, 4, 3, 1].map((number) => roomPhoto(ecoPhotoManifest, number));
export const doubleRoomPhotos = [1, 3, 2, 4, 5, 6].map((number) => roomPhoto(doublePhotoManifest, number));
export const tripleRoomPhotos = [4, 7, 6, 9, 2, 3, 5, 8, 1].map((number) => roomPhoto(triplePhotoManifest, number));
export const familyRoomPhotos = [7, 1, 3, 2, 9, 6, 8, 4, 5].map((number) => roomPhoto(familyPhotoManifest, number));
const highResolutionPhotos = new Map([...ecoRoomPhotos, ...doubleRoomPhotos, ...tripleRoomPhotos, ...familyRoomPhotos].map((photo) => [photo.src, photo]));

// Standalone images can still use the existing gallery fallback.
export function getRoomGalleryImage(src: string): RoomPhoto {
  return highResolutionPhotos.get(src) ?? { src, width: 2000, height: 1333 };
}

export function getRoomCoverImage(src: string) {
  const photo = highResolutionPhotos.get(src);
  return {
    src,
    srcSet: photo?.srcSet,
    width: photo?.width ?? 1800,
    height: photo?.height ?? 1200,
  };
}

export const ecoMinibarImage = getRoomCoverImage(roomPhoto(ecoPhotoManifest, 9).src);
export const familyCoverImage = getRoomCoverImage(familyRoomPhotos[0].src);
