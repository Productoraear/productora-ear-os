export interface CountryConfig {
  code: string;           // "ES", "MX", "US", "CO", etc.
  name: string;
  currency: string;       // "EUR", "MXN", "USD", "COP"
  currencySymbol: string; // "€", "$", "$", "$"
  phonePrefix: string;    // "+34", "+52", "+1", "+57"
  distanceUnit: "km" | "miles";
  defaultIncludedRadius: number; // Ej: 100 km
  defaultLocale: "es" | "en" | "fr" | "de" | "it" | "pt";
}

export const COUNTRIES: Record<string, CountryConfig> = {
  ES: {
    code: "ES",
    name: "España",
    currency: "EUR",
    currencySymbol: "€",
    phonePrefix: "+34",
    distanceUnit: "km",
    defaultIncludedRadius: 100,
    defaultLocale: "es",
  },
  MX: {
    code: "MX",
    name: "México",
    currency: "MXN",
    currencySymbol: "$",
    phonePrefix: "+52",
    distanceUnit: "km",
    defaultIncludedRadius: 50,
    defaultLocale: "es",
  },
  US: {
    code: "US",
    name: "United States",
    currency: "USD",
    currencySymbol: "$",
    phonePrefix: "+1",
    distanceUnit: "miles",
    defaultIncludedRadius: 60,
    defaultLocale: "en",
  },
  CO: {
    code: "CO",
    name: "Colombia",
    currency: "COP",
    currencySymbol: "$",
    phonePrefix: "+57",
    distanceUnit: "km",
    defaultIncludedRadius: 40,
    defaultLocale: "es",
  },
  FR: {
    code: "FR",
    name: "France",
    currency: "EUR",
    currencySymbol: "€",
    phonePrefix: "+33",
    distanceUnit: "km",
    defaultIncludedRadius: 80,
    defaultLocale: "fr",
  },
};

export const DEFAULT_COUNTRY = COUNTRIES["ES"];