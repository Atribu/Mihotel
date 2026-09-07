type ImagePageHeroProps = {
  id: string;
  eyebrow: string;
  title: string;
  italic: string;
  description: string;
  image: string;
  imageAlt: string;
  imageWidth?: number;
  imageHeight?: number;
  variant?: "about" | "contact" | "gallery";
};

export function ImagePageHero({
  id,
  eyebrow,
  title,
  italic,
  description,
  image,
  imageAlt,
  imageWidth = 1800,
  imageHeight = 1200,
  variant,
}: ImagePageHeroProps) {
  const variantClass = variant ? ` image-page-hero--${variant}` : "";

  return (
    <section className={`reference-hero image-page-hero${variantClass}`} aria-labelledby={id}>
      <img
        className="reference-hero__image"
        src={image}
        alt={imageAlt}
        width={imageWidth}
        height={imageHeight}
        loading="eager"
        fetchPriority="high"
      />
      <div className="reference-hero__veil" />
      <div className="reference-hero__content shell">
        <p className="reference-kicker reference-kicker--light">{eyebrow}</p>
        <h1 id={id}>{title}<br /><em>{italic}</em></h1>
        <p>{description}</p>
      </div>
    </section>
  );
}
