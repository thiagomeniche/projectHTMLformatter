// main.js

// Importa o módulo zipProcessor.js
import { processFiles } from './fileProcessor.js';
import { processAndDownloadZip } from './zipProcessor.js';
import './linkUpdater.js';  // Importe linkUpdater.js aqui



// Adicione aqui qualquer outro código necessário no main.js
document.getElementById('processButton').addEventListener('click', processFiles);

// Exemplo de como usar a função do zipProcessor.js
var fileInput = document.getElementById('fileInput');

fileInput.addEventListener('change', function (event) {
    var zipFile = event.target.files[0];

    if (zipFile && zipFile.name.endsWith('.zip')) {
        // Chama a função processAndDownloadZip do zipProcessor.js
        processAndDownloadZip(zipFile);
    } 
});
