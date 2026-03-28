import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { primary, neutral } from '@/design-tokens';
import { usePWAStore } from '@/store/pwaStore';

export function PWAInstallModal() {
  const showIOSModal = usePWAStore((state) => state.showIOSModal);
  const setShowIOSModal = usePWAStore((state) => state.setShowIOSModal);

  return (
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
  );
}
