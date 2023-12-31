// linkUpdater.js

// Nova função para atualizar os links
export function updateLinks(modifiedContent, fileName) {
    // Use uma expressão regular para encontrar referências a arquivos
    var linkRegex = /<a\s+(?:[^>]*?\s+)?href="([^"]*\.[^"]*)"(?:\s+[^>]*)?>/g;
  
    modifiedContent = modifiedContent.replace(linkRegex, function (match, href) {
      // Obtém o nome do arquivo sem a extensão
      var originalFileName = href.split('/').pop();
      var fileNameWithoutExtension = originalFileName.split('.').slice(0, -1).join('.');
      var fileExtension = originalFileName.split('.').pop();
  
      // Adiciona o caminho 'img/' ao nome do arquivo
      var newFileName = fileNameWithoutExtension + '.' + fileExtension;
  
      // Remove espaços após a extensão .html
      newFileName = newFileName.replace(/\.html\s+/i, '.html');
  
      // Substitui a referência para a nova localização do arquivo
      return match.replace(href, newFileName);
    });
  
    return modifiedContent;
  }


// Nova função para atualizar os links das imagens
export function updateImageLinks(modifiedContent, fileName) {
    // Use uma expressão regular para encontrar referências a imagens
    var imgRegex = /<img\s+(?:[^>]*?\s+)?src="([^"]*\.(jpg|jpeg|png|gif))"(?:\s+[^>]*)?>/g;
  
    modifiedContent = modifiedContent.replace(imgRegex, function (match, src) {
      // Obtém o nome do arquivo da imagem sem o caminho do diretório
      var imageName = src.split(/[\\\/]/).pop().split('.')[0];
  
      // Adiciona o caminho 'img/' ao nome da imagem, mantendo a extensão
      var newSrc = 'img/' + imageName + src.slice(src.lastIndexOf('.'));
  
      // Substitui a referência para a nova localização da imagem
      return match.replace(src, newSrc);
    });
  
    return modifiedContent;
  }

  export function updateVideoLinks(modifiedContent, fileName) {
    // Use uma expressão regular para encontrar referências a arquivos de vídeo
    var videoRegex = /<(video|embed|source)\s+(?:[^>]*?\s+)?src="([^"]*\.(avi|mp4|m4v|mov|wmv))"(?:\s+[^>]*)?>/g;
  
    const matches = modifiedContent.match(videoRegex);
    if (matches) {
      console.log(`O arquivo HTML ${fileName} contém referências a arquivos de vídeo: ${matches.join(', ')}`);
    }
  
    // Substitui as referências a arquivos de vídeo
    modifiedContent = modifiedContent.replace(videoRegex, function (match, tag, src) {
      // Obtém o nome do vídeo sem a extensão
      var videoName = src.split(/[\\\/]/).pop().split('.')[0];
  
      // Adiciona o caminho 'video/' ao nome do vídeo e mantém a extensão
      var newSrc = 'video/' + videoName + '.' + src.split('.').pop();
  
      // Substitui a referência ao vídeo
      return match.replace(src, newSrc);
    });
  
    return modifiedContent;
  }
  