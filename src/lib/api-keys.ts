
// Store API keys in a secure way
// In a production app, these would come from environment variables or secure storage
let elevenlabsApiKey: string | null = localStorage.getItem('ELEVENLABS_API_KEY');
let huggingfaceApiKey: string | null = localStorage.getItem('HUGGINGFACE_API_KEY');

export const setElevenlabsApiKey = (key: string) => {
  elevenlabsApiKey = key;
  localStorage.setItem('ELEVENLABS_API_KEY', key);
};

export const setHuggingfaceApiKey = (key: string) => {
  huggingfaceApiKey = key;
  localStorage.setItem('HUGGINGFACE_API_KEY', key);
};

export const getElevenlabsApiKey = (): string | null => {
  return elevenlabsApiKey;
};

export const getHuggingfaceApiKey = (): string | null => {
  return huggingfaceApiKey;
};

// Initialize with provided keys if available
export const initializeApiKeys = () => {
  // These would typically come from environment variables or a secure backend
  const elevenLabsKey = "sk_50370d6b644c49ee8d4a441ebeb0386ae366a7a825ad999e";
  const huggingFaceKey = "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";
  
  if (!getElevenlabsApiKey() && elevenLabsKey) {
    setElevenlabsApiKey(elevenLabsKey);
  }
  
  if (!getHuggingfaceApiKey() && huggingFaceKey) {
    setHuggingfaceApiKey(huggingFaceKey);
  }
};
