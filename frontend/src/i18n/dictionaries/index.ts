import {
    defaultLocale,
    isLocale,
    type Locale,
  } from "../locales";
  import { enDictionary } from "./en";
  import {
    jaDictionary,
    type NavigationKey,
    type UiDictionary,
  } from "./ja";
  import { zhDictionary } from "./zh";
  
  export const dictionaries: Record<Locale, UiDictionary> = {
    ja: jaDictionary,
    en: enDictionary,
    zh: zhDictionary,
  };
  
  export function getDictionary(locale: Locale = defaultLocale): UiDictionary {
    return dictionaries[locale];
  }
  
  export function getDictionaryByLocale(
    locale: string | null | undefined,
  ): UiDictionary {
    if (isLocale(locale)) {
      return dictionaries[locale];
    }
  
    return dictionaries[defaultLocale];
  }
  
  export function getNavigationLabel(
    locale: Locale,
    key: NavigationKey,
  ): string {
    return getDictionary(locale).navigation[key];
  }
  
  export type {
    FooterSectionKey,
    NavigationKey,
    TermCategoryKey,
    TermLevelKey,
    UiDictionary,
  } from "./ja";