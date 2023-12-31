// Desatualizado


import { updateLinks } from './linkUpdater.js';
import { updateImageLinks } from './linkUpdater.js';
import { processAndDownloadZip } from './zipProcessor.js'


export function processFiles() {
    var fileInput = document.getElementById('fileInput');

    if (fileInput.files.length > 0) {
        // Itera sobre cada arquivo selecionado
        Array.from(fileInput.files).forEach(function (file) {
            if (file.name.endsWith('.zip')) {
                processAndDownloadZip(file);
            } else {
                processHTMLFile(file);
            }
        });
    } else {
        alert('Por favor, selecione um ou mais arquivos.');
    }
}

function processHTMLFile(file) {
    var reader = new FileReader();

    reader.onload = function (e) {
        var fileContent = e.target.result;

        // Aqui, você pode manipular o conteúdo como desejar
        var modifiedContent = fileContent.replace('<head>', `
            <head>
                <!-- Adicione jQuery -->
                <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
                <!-- Adicione os estilos do Bootstrap -->
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">`);

        // Modifica as tags HTML para usar os estilos do Bootstrap
        modifiedContent = modifiedContent.replace('<html>', '<html lang="pt-br">');
        modifiedContent = modifiedContent.replace('<body>', '<body class="container">');

        // Modifica as tags HTML específicas
        modifiedContent = modifiedContent.replace(/<b>/g, '<li class="list-group-item">');
        modifiedContent = modifiedContent.replace(/<ul>/g, '<ul class="list-group">');
        modifiedContent = modifiedContent.replace(/<li>/g, '<li class="list-group-item">');
        modifiedContent = modifiedContent.replace(/<hr>/g, '<hr class="my-4">');

        // Atualiza os links
        modifiedContent = updateLinks(modifiedContent, file.name);
        modifiedContent = updateImageLinks(modifiedContent, file.name);

        var newContent = `<html>${modifiedContent}</html>`;

        // Obtém o nome do arquivo original
        var originalFileName = file.name;

        // Cria um novo arquivo HTML incorporando o conteúdo
        var blob = new Blob([newContent], { type: 'text/html' });

        // Cria um link temporário para download
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);

        // Define o nome do arquivo como o nome original
        link.download = originalFileName;

        // Adiciona o link ao corpo do documento
        document.body.appendChild(link);

        // Simula um clique no link para iniciar o download
        link.click();

        // Remove o link após o download
        document.body.removeChild(link);
    };

    reader.readAsText(file);
}

