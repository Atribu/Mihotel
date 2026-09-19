import photoManifest from "./hotel-photo-manifest.json";

// Preserve the existing sequence, followed by the newly supplied spaces and details.
export const hotelPhotoNumbers = [26, 7, 9, 10, 11, 18, 21, 22, 6, 14, 15, 23, 25, 27, 28, 19, 20, 1, 2, 3, 4, 5, 8, 12, 13, 16, 17, 24] as const;

type HotelPhotoNumber = (typeof hotelPhotoNumbers)[number];

function photoMetadata(number: HotelPhotoNumber) {
  const photo = photoManifest.find((item) => item.number === number);
  if (!photo) throw new Error(`Missing hotel photo metadata: ${number}`);
  return photo;
}

function hotelPhoto(number: HotelPhotoNumber) {
  const { variants } = photoMetadata(number);
  const display = variants[variants.length - 1];
  return {
    ...display,
    srcSet: variants.map((variant) => `${variant.src} ${variant.width}w`).join(", "),
  };
}

export const hotelImages = {
  reception: hotelPhoto(9),
  lobby: hotelPhoto(7),
  lobbyWide: hotelPhoto(10),
  seating: hotelPhoto(11),
  corridor: hotelPhoto(14),
  stairs: hotelPhoto(27),
  courtyardSeating: hotelPhoto(18),
  courtyard: hotelPhoto(21),
  exterior: hotelPhoto(26),
  exteriorDay: hotelPhoto(28),
};

export const hotelGalleryImages = hotelPhotoNumbers.map((number) => {
  const { variants, full } = photoMetadata(number);
  return {
    id: `hotel-${number}`,
    ...hotelPhoto(number),
    thumbnailSrc: variants[0].src,
    fullSrc: full.src,
    fullWidth: full.width,
    fullHeight: full.height,
  };
});
