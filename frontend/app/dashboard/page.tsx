"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getFavourites, addFavourite, removeFavourite, Favourite } from "@/lib/api";
import { MOCK_PROPERTIES } from "@/lib/properties";
import PropertyCard from "@/components/PropertyCard";
import { useToast } from "@/components/ui/Toast";

type Tab = "browse" | "favourites";

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();
  const { show, ToastEl } = useToast();

  const [favourites, setFavourites] = useState<Favourite[]>([]);
  const [loadingFavs, setLoadingFavs] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("browse");

  const fetchFavourites = useCallback(async () => {
    try {
      const data = await getFavourites();
      setFavourites(data.favourites);
    } catch {
      show("Failed to load favourites", "error");
    } finally {
      setLoadingFavs(false);
    }
  }, [show]);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user) fetchFavourites();
  }, [user, fetchFavourites]);

  const isFavourited = (propertyId: string) =>
    favourites.some((f) => f.propertyId === propertyId);

  const toggleFavourite = async (propertyId: string) => {
    if (togglingId) return;
    setTogglingId(propertyId);
    try {
      if (isFavourited(propertyId)) {
        await removeFavourite(propertyId);
        setFavourites((prev) => prev.filter((f) => f.propertyId !== propertyId));
        show("Removed from favourites", "success");
      } else {
        const data = await addFavourite(propertyId);
        setFavourites((prev) => [...prev, data.favourite]);
        show("Added to favourites ❤️", "success");
      }
    } catch (err: unknown) {
      show(err instanceof Error ? err.message : "Action failed", "error");
    } finally {
      setTogglingId(null);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-cream">
        <span className="text-stone text-sm">Loading…</span>
      </div>
    );
  }

  const favouritedProperties = MOCK_PROPERTIES.filter((p) => isFavourited(p.id));

  return (
    <>
      {ToastEl}
      <div className="min-h-screen bg-cream">

     
        <header className="sticky top-0 z-50 bg-surface border-b border-border px-6 h-16 flex items-center justify-between">
          <span className="font-serif text-xl text-ink">🏡 Nestly</span>

          <div className="flex items-center gap-4">
            
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-clay-light flex items-center justify-center font-serif text-ink font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="leading-tight hidden sm:block">
                <p className="text-sm font-medium text-ink">{user.name}</p>
                <p className="text-[10px] uppercase tracking-widest text-stone">{user.role}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-border rounded-btn text-sm text-stone hover:border-clay hover:text-ink transition-colors"
            >
              Sign out
            </button>
          </div>
        </header>

    
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        
          <div className="mb-8">
            <h1 className="font-serif text-3xl text-ink mb-1">
              Good day, {user.name.split(" ")[0]}
            </h1>
            <p className="text-stone text-sm">
              {favourites.length === 0
                ? "Browse properties below and heart the ones you love."
                : `You have ${favourites.length} saved ${favourites.length === 1 ? "property" : "properties"}.`}
            </p>
          </div>

        
          <div className="flex gap-1 bg-surface border border-border rounded-btn p-1 w-fit mb-7">
            {(["browse", "favourites"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={[
                  "px-5 py-2 rounded-[10px] text-sm font-medium transition-all",
                  tab === t
                    ? "bg-ink text-cream"
                    : "text-stone hover:text-ink",
                ].join(" ")}
              >
                {t === "browse"
                  ? "Browse All"
                  : `My Favourites${favourites.length > 0 ? ` (${favourites.length})` : ""}`}
              </button>
            ))}
          </div>

                   {tab === "browse" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {MOCK_PROPERTIES.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  isFavourited={isFavourited(property.id)}
                  onToggle={toggleFavourite}
                  loading={togglingId === property.id}
                />
              ))}
            </div>
          )}

                  {tab === "favourites" && (
            loadingFavs ? (
              <p className="text-stone text-sm py-8">Loading your favourites…</p>
            ) : favouritedProperties.length === 0 ? (
              <div className="flex flex-col items-center text-center py-20">
                <span className="text-5xl mb-4">🤍</span>
                <h3 className="font-serif text-xl text-ink mb-2">No favourites yet</h3>
                <p className="text-stone text-sm mb-6 max-w-xs">
                  Browse properties and tap the heart icon to save them here.
                </p>
                <button
                  onClick={() => setTab("browse")}
                  className="px-6 py-2.5 bg-ink text-cream rounded-btn text-sm font-medium hover:bg-ink/90 transition-colors"
                >
                  Browse properties
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {favouritedProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    isFavourited={true}
                    onToggle={toggleFavourite}
                    loading={togglingId === property.id}
                  />
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}