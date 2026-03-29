"use client";

import { Property } from "@/lib/properties";

interface PropertyCardProps {
  property: Property;
  isFavourited: boolean;
  onToggle: (propertyId: string) => void;
  loading?: boolean;
}

const TAG_CLASSES: Record<string, string> = {
  New:     "bg-sage text-white",
  Hot:     "bg-terracotta text-white",
  Premium: "bg-clay text-ink",
};

export default function PropertyCard({
  property,
  isFavourited,
  onToggle,
  loading,
}: PropertyCardProps) {
  return (
    <div className="bg-surface border border-border rounded-card overflow-hidden flex flex-col hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">

      {/* Thumbnail */}
      <div className="relative h-40 bg-linear-to-br from-clay-light to-cream flex items-center justify-center">
        <span className="text-4xl opacity-40">🏠</span>

        {/* Tag badge */}
        {property.tag && (
          <span
            className={[
              "absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-md",
              TAG_CLASSES[property.tag] ?? "bg-ink text-cream",
            ].join(" ")}
          >
            {property.tag}
          </span>
        )}

        {/* Heart button */}
        <button
          onClick={() => onToggle(property.id)}
          disabled={loading}
          title={isFavourited ? "Remove from favourites" : "Add to favourites"}
          className={[
            "absolute top-3 right-3 w-9 h-9 rounded-full bg-surface border border-border",
            "flex items-center justify-center text-base",
            "hover:border-clay hover:scale-110 transition-all duration-150",
            loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
          ].join(" ")}
        >
          {isFavourited ? "❤️" : "🤍"}
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <span className="text-[10px] font-medium uppercase tracking-widest text-stone mb-1">
          {property.type}
        </span>

        <h3 className="font-serif text-base text-ink mb-1 leading-snug">
          {property.title}
        </h3>

        <p className="text-xs text-stone mb-3">📍 {property.location}</p>

        <div className="flex gap-3 text-xs text-stone mb-4">
          <span>🛏 {property.beds} beds</span>
          <span>🚿 {property.baths} baths</span>
          <span>📐 {property.sqft.toLocaleString()} sqft</span>
        </div>

        <div className="mt-auto">
          <span className="font-serif text-lg text-ink">{property.price}</span>
        </div>
      </div>
    </div>
  );
}