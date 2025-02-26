"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface GeolocationContextType {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
}

const GeolocationContext = createContext<GeolocationContextType | undefined>(undefined);

export function GeolocationProvider({ children }: { children: ReactNode }) {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Trình duyệt không hỗ trợ Geolocation");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (err) => {
        setError(err.message);
      }
    );
  }, []);

  return (
    <GeolocationContext.Provider value={{ latitude, longitude, error }}>
      {children}
    </GeolocationContext.Provider>
  );
}

export function useGeolocation() {
  const context = useContext(GeolocationContext);
  if (!context) {
    throw new Error("useGeolocation phải được dùng bên trong GeolocationProvider");
  }
  return context;
}
