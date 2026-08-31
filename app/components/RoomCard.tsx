import Link from "next/link";
import type { Room } from "../lib/site-data";

export function RoomCard({ room, featured = false }: { room: Room; featured?: boolean }) {
  return (
    <article className={`room-card${featured ? " room-card--featured" : ""}`}>
      <div className="room-card__media">
        <img src={room.cover} alt={`${room.name} iç mekânı`} loading="lazy" />
        <span>{room.size}</span>
      </div>
      <div className="room-card__body">
        <h3>{room.name}</h3>
        <p>{room.description}</p>
        <div className="chip-list" aria-label={`${room.name} olanakları`}>
          {room.amenities.slice(0, 3).map((amenity) => (
            <span className="chip" key={amenity}>{amenity}</span>
          ))}
        </div>
        <Link className="text-link" href={`/odalar/${room.slug}`}>
          Odayı incele <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
