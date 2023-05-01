export const getProviderName = (providerId, providers, fallbackName) => {
  if (!providerId || providers.length === 0) {
    return fallbackName;
  }
  return providers.find((provider) => provider.id === providerId)?.nameEnglish || fallbackName;
};
