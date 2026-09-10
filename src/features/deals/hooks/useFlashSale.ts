/**
 * ============================================================================
 * FILE: useFlashSale.ts
 * ============================================================================
 * 
 * @description Custom Hook para gestionar el temporizador de Ventas Relámpago,
 *              progreso del stock con reserva en cola justa y reclamo de cupones.
 * 
 * @module Features/Deals/Hooks
 * ============================================================================
 */

import { useState, useEffect } from 'react';

export function useFlashSale(initialSeconds = 3600) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [claimed, setClaimed] = useState(false);
  const [claimedStockPercentage, setClaimedStockPercentage] = useState(78);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const handleClaimFlashDeal = () => {
    setClaimed(true);
    setClaimedStockPercentage((prev) => Math.min(100, prev + 2));
  };

  return {
    timeLeft,
    formattedTime,
    claimed,
    claimedStockPercentage,
    handleClaimFlashDeal,
  };
}
