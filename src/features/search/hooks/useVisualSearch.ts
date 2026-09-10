/**
 * ============================================================================
 * FILE: useVisualSearch.ts
 * ============================================================================
 * 
 * @description Custom Hook para gestionar el modal de búsqueda visual por imagen,
 *              carga de fotos, escaneo con IA y obtención de coincidencias.
 * 
 * @module Features/Search/Hooks
 * ============================================================================
 */

import { useState } from 'react';

export interface VisualMatchProduct {
  id: string;
  title: string;
  price: number;
  matchPercentage: number;
  imageUrl: string;
}

export function useVisualSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [matches, setMatches] = useState<VisualMatchProduct[]>([]);

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setSelectedImage(null);
    setMatches([]);
    setIsScanning(false);
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      simulateAIScan();
    };
    reader.readAsDataURL(file);
  };

  const simulateAIScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setMatches([
        {
          id: 'p1',
          title: 'Auriculares Inalámbricos Bluetooth Pro',
          price: 18500,
          matchPercentage: 98,
          imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
        },
        {
          id: 'p2',
          title: 'Auriculares Cancelación de Ruido Activa',
          price: 24900,
          matchPercentage: 89,
          imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&q=80',
        },
      ]);
    }, 1800);
  };

  return {
    isOpen,
    openModal,
    closeModal,
    selectedImage,
    handleImageUpload,
    isScanning,
    matches,
  };
}
