import { ScrollViewStyleReset } from 'expo-router/html';

// This file is web-only and used to configure the root HTML for every
// web page during static rendering.
// The contents of this function only run in Node.js environments and
// do not have access to the DOM or browser APIs.
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        {/* viewport-fit=cover: 노치/홈바 등 safe area를 포함한 전체 화면 사용 */}
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover" />
        
        {/* PWA 메타 태그 */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="FitCast" />
        <meta name="theme-color" content="#ffffff" />
        
        {/* SEO */}
        <meta name="description" content="FitCast - AI 의류 케어 & OOTD 아카이브" />
        <title>FitCast</title>

        {/* 
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native. 
          However, body scrolling is often nice to have for mobile web. If you want to enable it, remove this line.
        */}
        <ScrollViewStyleReset />

        {/* Safe area와 레이아웃 안정성을 위한 글로벌 CSS */}
        <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const globalStyles = `
/* 기본 배경 */
body {
  background-color: #fff;
  /* 웹 브라우저/PWA에서 safe area 패딩 적용 */
  padding-top: env(safe-area-inset-top, 0px);
  padding-bottom: env(safe-area-inset-bottom, 0px);
  padding-left: env(safe-area-inset-left, 0px);
  padding-right: env(safe-area-inset-right, 0px);
}

@media (prefers-color-scheme: dark) {
  body {
    background-color: #000;
  }
}

/* 전체 앱 영역이 뷰포트를 정확히 채우도록 설정 */
html, body, #root {
  height: 100%;
  overflow: hidden;
}

/* 카카오톡 등 인앱 브라우저에서 상단 여백 확보 */
@supports not (padding-top: env(safe-area-inset-top)) {
  body {
    padding-top: 0px;
  }
}
`;
