import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import type { UserProfile, UserTrack, ProgramStatus, SubscriptionTier } from '../types/user';
import { getCurrentWeekTemplate } from '../lib/programTemplates';

const defaultProfile: Omit<UserProfile, 'createdAt' | 'updatedAt'> = {
  track: 'explorer',
  programStatus: 'inactive',
  currentCycle: 0,
  startDate: null,
  bridalDeadline: null,
  subscriptionPlan: 'none',
  baseline: {}
};

export function useUserTrack() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) return;
    const fetchProfile = async () => {
      try {
        const ref = doc(db, 'users', userId, 'profile', 'main');
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setProfile(snap.data() as UserProfile);
        } else {
          const now = new Date().toISOString();
          const newProfile = { ...defaultProfile, createdAt: now, updatedAt: now } as UserProfile;
          await setDoc(ref, newProfile);
          setProfile(newProfile);
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!userId || !profile) return;
    const ref = doc(db, 'users', userId, 'profile', 'main');
    await updateDoc(ref, { ...data, updatedAt: new Date().toISOString() });
    setProfile(prev => prev ? { ...prev, ...data, updatedAt: new Date().toISOString() } : null);
  };

  // ✅ NUEVO: Métodos específicos para programa
  const startProgram = () => {
    const today = new Date().toISOString().split('T')[0];
    return updateProfile({ 
      programStatus: 'active', 
      currentCycle: 1, 
      startDate: today,
      track: 'program'
    });
  };

  const completeWeek = async (weekNumber: number) => {
    if (!profile || profile.programStatus !== 'active') return;
    
    // Si completa la semana 8, ofrecer siguiente ciclo o mantenimiento
    if (weekNumber >= 8) {
      return updateProfile({ 
        programStatus: 'completed',
        // currentCycle se incrementa si decide continuar
      });
    }
    // Para semanas 1-7: solo registrar progreso (se puede expandir con colección de completados)
    return Promise.resolve();
  };

  const getCurrentWeekData = () => {
    if (!profile || profile.programStatus !== 'active') return null;
    return getCurrentWeekTemplate(profile.track, profile.currentCycle, profile.startDate);
  };

  const advanceToNextCycle = () => {
    if (!profile) return;
    const today = new Date().toISOString().split('T')[0];
    return updateProfile({
      currentCycle: profile.currentCycle + 1,
      startDate: today,
      programStatus: 'active'
    });
  };

  const switchToMaintenance = () => {
    return updateProfile({ programStatus: 'maintenance' });
  };

  return { 
    profile, 
    loading, 
    updateProfile,
    setTrack: (track: UserTrack) => updateProfile({ track }),
    setProgramStatus: (status: ProgramStatus) => updateProfile({ programStatus: status }),
    setSubscription: (plan: SubscriptionTier) => updateProfile({ subscriptionPlan: plan }),
    setBridalDeadline: (date: string) => updateProfile({ bridalDeadline: date }),
    // ✅ Nuevos métodos
    startProgram,
    completeWeek,
    getCurrentWeekData,
    advanceToNextCycle,
    switchToMaintenance
  };
}
