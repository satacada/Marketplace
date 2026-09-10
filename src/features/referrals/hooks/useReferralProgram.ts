/**
 * ============================================================================
 * FILE: useReferralProgram.ts
 * ============================================================================
 * 
 * @description Custom Hook para gestionar el programa de referidos B2C/B2B,
 *              generación de enlaces únicos y saldo de recompensas.
 * 
 * @module Features/Referrals/Hooks
 * ============================================================================
 */

import { useState } from 'react';

export function useReferralProgram(userId: string | null = null) {
  const referralCode = userId ? `REF-${userId.substring(0, 6).toUpperCase()}` : 'REF-SAAS2026';
  const referralLink = typeof window !== 'undefined'
    ? `${window.location.origin}/auth/register?ref=${referralCode}`
    : `https://marketplace-saas.com/auth/register?ref=${referralCode}`;

  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const referralStats = {
    totalInvited: 4,
    successfulPurchases: 3,
    earnedCredits: 15000,
    commissionDiscountDays: 30,
  };

  return {
    referralCode,
    referralLink,
    copied,
    copyLink,
    referralStats,
  };
}
