const isValidUrl = (url: string): boolean => /^https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=]+$/.test(url);

export default isValidUrl;
