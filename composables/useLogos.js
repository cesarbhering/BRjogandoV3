export const useLogos = () => {
  /**
   * Retorna o url do thumb do logo carregado no panda score, caso não tenha exibe a bandeira do país da organização.
   * @param {Number} opponentNumber index do opponent dentro do array recebido na props matchInfo.opponents.
   * @returns {Object} {URL: URL da logo do time ou da bandeira da organização, ALT: Descrição da imagem}.
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
    // Quando for BR importar o br-flag.svg que já temos no assets, pra economizar tempo de download.
    if (nationality) {
      return `https://flagcdn.com/${nationality.toLowerCase()}.svg`
    }
    
  };
  return { teamLogoThumb };
};
