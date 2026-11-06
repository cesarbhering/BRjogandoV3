export const useLogos = () => {
  /**
   * Returns the URL of the team logo thumbnail from PandaScore. If there is no logo, returns the flag of the organization's country.
   * @param {String} defaultImgUrl Team logo URL from PandaScore.
   * @param {String} nationality Country code used for the flag fallback.
   * @returns {String} URL of the team logo or of the organization's flag.
   */
  const teamLogoThumb = (defaultImgUrl, nationality) => {
    if (defaultImgUrl) {
      const originalURL =
        defaultImgUrl;
      const parts = originalURL.split("/");
      const filename = parts.pop(); // Get the filename
      const newFilename = "thumb_" + filename;
      parts.push(newFilename); // Replace the filename with the new one
      const transformedURL = parts.join("/");
      return transformedURL
    
    }
    // TODO: for BR, use the br-flag.svg already in assets to save a download.
    if (nationality) {
      // In mock mode the flags are served from public/mocks/flags
      if (useRuntimeConfig().public.mockData) {
        return `/mocks/flags/${nationality.toLowerCase()}.webp`
      }
      return `https://flagcdn.com/w160/${nationality.toLowerCase()}.webp`
    }
    
  };
  return { teamLogoThumb };
};
