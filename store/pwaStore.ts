import { create } from 'zustand';
import { Platform } from 'react-native';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAStore {
  deferredPrompt: BeforeInstallPromptEvent | null;
  isStandalone: boolean;
  showIOSModal: boolean;
  setDeferredPrompt: (prompt: BeforeInstallPromptEvent | null) => void;
  setStandalone: (status: boolean) => void;
  setShowIOSModal: (show: boolean) => void;
  init: () => void;
  promptInstall: () => Promise<boolean>;
}

export const usePWAStore = create<PWAStore>((set, get) => ({
  deferredPrompt: null,
  isStandalone: false,
  showIOSModal: false,

  setDeferredPrompt: (prompt) => set({ deferredPrompt: prompt }),
  setStandalone: (status) => set({ isStandalone: status }),
  setShowIOSModal: (show) => set({ showIOSModal: show }),

  init: () => {
    if (Platform.OS !== 'web') return;

    // 이미 PWA(Standalone) 모드인지 감지
    const standalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    
    set({ isStandalone: standalone });

    // beforeinstallprompt 이벤트 리스닝 (설치 가능 환경)
    const handler = (e: Event) => {
      e.preventDefault();
      set({ deferredPrompt: e as BeforeInstallPromptEvent });
    };

    window.addEventListener('beforeinstallprompt', handler);

    // cleanup은 보통 전역 스토어 특성상 불필요하나,
    // HMR 등에서 중복 등록 방지용으로 설계하는 경우도 있음.
  },

  promptInstall: async () => {
    const { deferredPrompt, isStandalone } = get();
    
    // 이미 설치된 상태면 안 함
    if (isStandalone) return false;

    // Android/Chrome: deferredPrompt가 있는 경우 네이티브 프롬프트 호출
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === 'accepted') {
        set({ deferredPrompt: null });
        return true;
      }
      return false;
    }

    // iOS/기타 브라우저: deferredPrompt가 없으므로 수동 안내 모달 노출
    // 단, OS가 웹일 경우에만
    if (Platform.OS === 'web') {
      const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
      if (isIOS) {
        set({ showIOSModal: true });
        return true;
      } else {
        // iOS가 아니면서 prompt도 안 뜬 브라우저의 경우 예외 처리
        set({ showIOSModal: true }); // 동일 모달 재사용
        return true;
      }
    }
    
    return false;
  }
}));
