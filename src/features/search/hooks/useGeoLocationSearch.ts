/**
 * ============================================================================
 * FILE: useGeoLocationSearch.ts
 * ============================================================================
 * 
 * @description Custom Hook para gestionar el radio de geolocalización GPS,
 *              tipo de despacho (Same-Day / Exprés < 2h, Retiro Hoy, Nacional)
 *              y cálculo de distancias de productos.
 * 
 * @module Features/Search/Hooks
 * ============================================================================
 */

import { useState } from 'react';

export type DeliveryTypeFilter = 'all' | 'express_2h' | 'pickup_today' | 'national';

export function useGeoLocationSearch() {
  const [userCity, setUserCity] = useState('Buenos Aires, CABA');
  const [radiusKm, setRadiusKm] = useState<number>(5);
  const [deliveryFilter, setDeliveryFilter] = useState<DeliveryTypeFilter>('all');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number }>({
    lat: -34.6037,
    lng: -58.3816,
  });

  const updateRadius = (newRadius: number) => {
    setRadiusKm(newRadius);
  };

  const updateDeliveryFilter = (filter: DeliveryTypeFilter) => {
    setDeliveryFilter(filter);
  };

  const calculateDistanceKm = (targetLat: number, targetLng: number): number => {
    const R = 6371; // Radio de la Tierra en Km
    const dLat = ((targetLat - userCoords.lat) * Math.PI) / 180;
    const dLng = ((targetLng - userCoords.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((userCoords.lat * Math.PI) / 180) *
        Math.cos((targetLat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  };

  return {
    userCity,
    setUserCity,
    radiusKm,
    updateRadius,
    deliveryFilter,
    updateDeliveryFilter,
    userCoords,
    setUserCoords,
    calculateDistanceKm,
  };
}
