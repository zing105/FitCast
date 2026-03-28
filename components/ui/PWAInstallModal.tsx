import React from 'react';
import { View, Text, TouchableOpacity, Modal, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { primary, neutral } from '@/design-tokens';
import { usePWAStore } from '@/store/pwaStore';

export function PWAInstallModal() {
  const showIOSModal = usePWAStore((state) => state.showIOSModal);
  const setShowIOSModal = usePWAStore((state) => state.setShowIOSModal);

  // 인앱 브라우저 감지 (카카오톡, 네이버, 페이스북, 인스타그램 등)
  const isInApp = typeof window !== 'undefined' && 
    /KAKAOTALK|NAVER|FBAN|FBAV|Instagram|Line/i.test(navigator.userAgent);

  const steps = isInApp ? [
    {
      id: 1,
      text: (
        <Text style={{ fontSize: 14, color: neutral[800] }}>
          우측 하단/상단의 <Text style={{ fontWeight: '700' }}>더보기(⋮) 메뉴</Text>를 누르세요
        </Text>
      ),
      icon: 'ellipsis-horizontal-circle-outline' as const
    },
    {
      id: 2,
      text: (
        <Text style={{ fontSize: 14, color: neutral[800] }}>
          <Text style={{ fontWeight: '700' }}>"다른 브라우저로 열기"</Text>를 선택하세요 (Safari/Chrome)
        </Text>
      ),
      icon: 'open-outline' as const
    },
    {
      id: 3,
      text: (
        <Text style={{ fontSize: 14, color: neutral[800] }}>
          그 후 다시 <Text style={{ fontWeight: '700' }}>"홈 화면에 앱 추가"</Text> 메뉴를 눌러주세요!
        </Text>
      ),
      icon: 'download-outline' as const
    }
  ] : [
    {
      id: 1,
      text: (
        <Text style={{ fontSize: 14, color: neutral[800] }}>
          하단의 <Text style={{ fontWeight: '700' }}>공유 버튼</Text> (⬆️)을 탭하세요
        </Text>
      ),
      icon: 'share-outline' as const
    },
    {
      id: 2,
      text: (
        <Text style={{ fontSize: 14, color: neutral[800] }}>
          <Text style={{ fontWeight: '700' }}>"홈 화면에 추가"</Text>를 선택하세요
        </Text>
      ),
      icon: 'add-circle-outline' as const
    },
    {
      id: 3,
      text: (
        <Text style={{ fontSize: 14, color: neutral[800] }}>
          홈 화면에 <Text style={{ fontWeight: '700' }}>FitCast 아이콘</Text>이 생성됩니다!
        </Text>
      ),
      icon: 'apps-outline' as const
    }
  ];

  return (
    <Modal
      visible={showIOSModal}
      transparent
      animationType="slide"
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
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            padding: 24,
            paddingBottom: 40,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -10 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 20
          }}
        >
          <View style={{ width: 40, height: 4, backgroundColor: neutral[200], borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />
          
          <Text style={{ fontSize: 20, fontWeight: '800', color: neutral[900], marginBottom: 8, textAlign: 'center' }}>
            {isInApp ? '브라우저 전환이 필요해요 🚀' : 'FitCast 설치하기'}
          </Text>
          <Text style={{ fontSize: 14, color: neutral[500], marginBottom: 24, textAlign: 'center' }}>
            {isInApp ? '더 원활한 사용을 위해 기본 브라우저를 이용해주세요' : '홈 화면에 추가하여 앱처럼 편리하게 사용하세요'}
          </Text>

          <View style={{ gap: 16, marginBottom: 32 }}>
            {steps.map((step) => (
              <View key={step.id} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: neutral[50], padding: 16, borderRadius: 20 }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: primary[50], alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                  <Ionicons name={step.icon} size={20} color={primary[500]} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 11, color: primary[500], fontWeight: '800', marginBottom: 2 }}>STEP {step.id}</Text>
                  {step.text}
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity
            onPress={() => setShowIOSModal(false)}
            style={{
              backgroundColor: primary[500],
              paddingVertical: 18,
              borderRadius: 20,
              alignItems: 'center',
              shadowColor: primary[500],
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>이해했습니다</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
