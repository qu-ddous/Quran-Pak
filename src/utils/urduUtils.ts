/**
 * Utility functions for detecting Urdu text and applying Jameel Noori Nastaleeq styling.
 */

// Characters specific to Urdu orthography:
// ٹ, ڈ, ڑ, ں, ے, ھ, چ, پ, گ, ژ, ۂ, ۃ, ئے, ؤ, etc.
const URDU_CHARS_REGEX = /[\u0679\u0688\u0691\u06BA\u06D2\u06BE\u0686\u067E\u06AF\u0698\u06C1\u06C2\u06C3]/;

// High-frequency Urdu function words and Islamic Urdu vocabulary
const URDU_WORDS_REGEX = /(?:^|\s)(ہے|ہیں|اور|میں|کی|کے|کا|کو|سے|نے|پر|تھا|تھی|تھے|ہوں|ہو|نہ|نہیں|کہ|یہ|وہ|اس|ان|ہم|تم|آپ|اپنے|اپنی|اپنا|جو|جب|تو|کر|کیا|دی|دیا|لئے|لیے|والا|والی|والے|تک|کریں|کرے|ہوتا|ہوتی|ہوتے|ساتھ|شروع|نام|مہربان|نہایت|رحم|تعریف|سب|طرح|پروردگار|مخلوقات|نماز|دعا|دعائیں|کتاب|صفحہ|باب|حنفی|مسائل|ترجمہ|مع|فضیلت|حوالہ|پڑھنے|بعد|پہلے|وقت|درود|سلام|کلمے|کلمہ)(?:\s|[،۔!؟]|$)/;

/**
 * Returns true if the string contains Urdu characters or common Urdu vocabulary
 */
export function isUrduText(text: string | null | undefined): boolean {
  if (!text) return false;
  return URDU_CHARS_REGEX.test(text) || URDU_WORDS_REGEX.test(text);
}

/**
 * Common style object for Urdu Nastaleeq typography
 */
export const URDU_FONT_FAMILY = "var(--font-urdu)";

export function getUrduTextStyle(isUrdu: boolean, customFontSize?: string) {
  if (!isUrdu) return {};
  return {
    fontFamily: URDU_FONT_FAMILY,
    direction: 'rtl' as const,
    textAlign: 'right' as const,
    lineHeight: 2.2,
    letterSpacing: 0,
    ...(customFontSize ? { fontSize: customFontSize } : {}),
  };
}
