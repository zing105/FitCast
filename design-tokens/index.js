/**
 * Design Tokens - Index
 * 모든 디자인 토큰 통합 내보내기
 */

import colors, {
    categoryColors,
    neutral,
    primary,
    secondary,
    semantic,
    surface,
    tertiary
} from './colors';

import typography, {
    fontFamily,
    fontSize,
    fontWeight,
    letterSpacing,
    lineHeight,
    textStyles
} from './typography';

import spacing, {
    borderRadius,
    elevation,
    semanticSpacing,
    spacing as spacingScale
} from './spacing';

export {
    borderRadius, categoryColors,
    // Colors
    colors, elevation, fontFamily,
    fontSize, fontWeight, letterSpacing, lineHeight, neutral, primary,
    secondary, semantic, semanticSpacing,
    // Spacing
    spacing,
    spacingScale, surface, tertiary, textStyles,
    // Typography
    typography
};

export default {
  colors,
  typography,
  spacing,
};
