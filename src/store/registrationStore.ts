import { create } from "zustand";
import {
  BaseRegistrationData,
  ResearcherRegistrationData,
} from "@/types/registration";

interface RegistrationStore {
  step: number;
  baseData: Partial<BaseRegistrationData> | null;
  researcherData: Partial<ResearcherRegistrationData> | null;

  setStep: (step: number) => void;
  setBaseData: (data: Partial<BaseRegistrationData>) => void;
  setResearcherData: (data: Partial<ResearcherRegistrationData>) => void;
  reset: () => void;
}

export const useRegistrationStore = create<RegistrationStore>((set) => ({
  step: 1,
  baseData: null,
  researcherData: null,

  setStep: (step) => set({ step }),
  setBaseData: (data) => set({ baseData: data }),
  setResearcherData: (data) => set({ researcherData: data }),
  reset: () => set({ step: 1, baseData: null, researcherData: null }),
}));
