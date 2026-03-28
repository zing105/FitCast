import { usePWAStore } from '../pwaStore';
import { Platform } from 'react-native';

// window 객체 모킹
const mockMatchMedia = jest.fn();
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia,
});

describe('usePWAStore', () => {
  const originalPlatformOS = Platform.OS;
  let originalWindowUserAgent: any;

  beforeAll(() => {
    // navigator 객체가 readonly 뜰 수 있으므로 우회
    originalWindowUserAgent = window.navigator.userAgent;
    Object.defineProperty(window.navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      configurable: true,
    });
  });

  afterAll(() => {
    Object.defineProperty(window.navigator, 'userAgent', {
      value: originalWindowUserAgent,
      configurable: true,
    });
  });

  beforeEach(() => {
    // 스토어 상태 초기화
    usePWAStore.setState({
      deferredPrompt: null,
      isStandalone: false,
      showIOSModal: false,
    });
    mockMatchMedia.mockClear();
    Platform.OS = 'web';
  });

  afterEach(() => {
    Platform.OS = originalPlatformOS;
  });

  it('초기 상태 확인', () => {
    const state = usePWAStore.getState();
    expect(state.deferredPrompt).toBeNull();
    expect(state.isStandalone).toBe(false);
    expect(state.showIOSModal).toBe(false);
  });

  it('init() - 이미 PWA 환경(standalone)인 경우 isStandalone이 true여야 한다', () => {
    mockMatchMedia.mockReturnValue({ matches: true });
    
    usePWAStore.getState().init();
    
    expect(usePWAStore.getState().isStandalone).toBe(true);
  });

  it('promptInstall() - deferredPrompt가 있을 때 Android(Chrome) 설치 로직이 실행되어야 한다', async () => {
    const mockPrompt = jest.fn();
    const mockUserChoice = Promise.resolve({ outcome: 'accepted' as const });
    
    const mockDeferredPrompt = {
      prompt: mockPrompt,
      userChoice: mockUserChoice,
    } as any;

    usePWAStore.setState({ deferredPrompt: mockDeferredPrompt });

    const result = await usePWAStore.getState().promptInstall();

    expect(mockPrompt).toHaveBeenCalled();
    expect(result).toBe(true);
    expect(usePWAStore.getState().deferredPrompt).toBeNull(); // 성공 후 null 처리
  });

  it('promptInstall() - deferredPrompt가 없고 웹이면서 iOS인 경우 showIOSModal이 true가 되어야 한다', async () => {
    // navigator.userAgent는 beforeEach 앞 단계에서 이미 iPhone으로 모킹됨
    // Platform.OS = 'web'도 beforeEach에 설정됨
    usePWAStore.setState({ deferredPrompt: null, isStandalone: false });

    const result = await usePWAStore.getState().promptInstall();

    expect(result).toBe(true);
    expect(usePWAStore.getState().showIOSModal).toBe(true);
  });
});
