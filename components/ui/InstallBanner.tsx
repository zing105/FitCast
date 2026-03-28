/**
 * PWA Install Banner Component
 * Android: beforeinstallprompt API로 네이티브 설치 팝업 트리거
 * iOS: 수동 설치 안내 모달 표시
 */
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Modal, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { primary, neutral } from '@/design-tokens';

// beforeinstallprompt 이벤트 타입
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    // 이미 PWA로 실행 중인지 확인
    const standalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as any).standalone === true;
    setIsStandalone(standalone);
    if (standalone) return;

    // Android/Chrome: beforeinstallprompt 이벤트 리스닝
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // iOS Safari 감지: beforeinstallprompt가 없으면 3초 후 배너 표시
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    if (isIOS) {
      const timer = setTimeout(() => setShowBanner(true), 2000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handler);
      };
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = useCallback(async () => {
    if (deferredPrompt) {
      // Android: 네이티브 설치 프롬프트 표시
      await deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      // iOS: 수동 안내 모달 표시
      setShowIOSModal(true);
    }
  }, [deferredPrompt]);

  const handleDismiss = () => {
    setShowBanner(false);
  };

  // 웹이 아니거나, 이미 PWA이거나, 배너 숨김 상태면 렌더링 안함
  if (Platform.OS !== 'web' || isStandalone || !showBanner) {
    return null;
  }

  return (
    <>
      {/* 설치 배너 */}
      <View
        style={{
          position: 'absolute',
          bottom: 80,
          left: 16,
          right: 16,
          backgroundColor: '#ffffff',
          borderRadius: 16,
          padding: 16,
          flexDirection: 'row',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 8,
          zIndex: 999,
        }}
      >
        {/* 앱 아이콘 */}
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: primary[50],
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}
        >
          <Ionicons name="download-outline" size={24} color={primary[500]} />
        </View>

        {/* 텍스트 */}
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: '700', fontSize: 14, color: neutral[900] }}>
            FitCast 앱 설치
          </Text>
          <Text style={{ fontSize: 12, color: neutral[500], marginTop: 2 }}>
            홈 화면에 추가하면 앱처럼 사용할 수 있어요
          </Text>
        </View>

        {/* 설치 버튼 */}
        <TouchableOpacity
          onPress={handleInstall}
          style={{
            backgroundColor: primary[500],
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            marginLeft: 8,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 13 }}>설치</Text>
        </TouchableOpacity>

        {/* 닫기 버튼 */}
        <TouchableOpacity
          onPress={handleDismiss}
          style={{ marginLeft: 8, padding: 4 }}
        >
          <Ionicons name="close" size={18} color={neutral[400]} />
        </TouchableOpacity>
      </View>

      {/* iOS 안내 모달 */}
      <Modal
        visible={showIOSModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowIOSModal(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowIOSModal(false)}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
          }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 24,
              paddingBottom: 40,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '700', color: neutral[900], marginBottom: 20, textAlign: 'center' }}>
              FitCast 설치 방법
            </Text>

            {/* Step 1 */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: primary[50], alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <Text style={{ fontWeight: '700', color: primary[500] }}>1</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, color: neutral[800] }}>
                  하단의 <Text style={{ fontWeight: '700' }}>공유 버튼</Text> (⬆️)을 탭하세요
                </Text>
              </View>
            </View>

            {/* Step 2 */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: primary[50], alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <Text style={{ fontWeight: '700', color: primary[500] }}>2</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, color: neutral[800] }}>
                  <Text style={{ fontWeight: '700' }}>"홈 화면에 추가"</Text>를 선택하세요
                </Text>
              </View>
            </View>

            {/* Step 3 */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: primary[50], alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <Text style={{ fontWeight: '700', color: primary[500] }}>3</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, color: neutral[800] }}>
                  홈 화면에 <Text style={{ fontWeight: '700' }}>FitCast 아이콘</Text>이 생성됩니다!
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setShowIOSModal(false)}
              style={{
                backgroundColor: primary[500],
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>확인</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
