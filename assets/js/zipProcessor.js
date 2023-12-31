import { updateLinks, updateVideoLinks, updateImageLinks } from './linkUpdater.js';

import { processBootstrap } from './bootstrapProcessor.js';

export async function processAndDownloadZip(zipFile) {
    const zipContent = await readZipFile(zipFile);
    const zip = await JSZip.loadAsync(zipContent);

    // Cria as pastas 'img', 'video', 'funcionalidades' e 'documentos'
    const imgFolder = zip.folder('img');
    const videoFolder = zip.folder('video');
    const funcFolder = zip.folder('funcionalidades');
    const docFolder = zip.folder('documentos');
    let imgFolderName = 'img';
    let videoFolderName = 'video';
    let funcFolderName = 'funcionalidades';
    let docFolderName = 'documentos';

    // Armazena os nomes dos arquivos HTML modificados
    const modifiedHTMLFiles = [];

    // Filtra os arquivos desejados
    const files = Object.values(zip.files).filter(zipEntry => !zipEntry.dir);

    // Itera sobre cada arquivo filtrado
    await Promise.all(
        files.map(async (zipEntry) => {
            const pathParts = zipEntry.name.split('/');
            const fileName = pathParts[pathParts.length - 1];

            if (fileName.match(/\.(html)$/i)) {
                const htmlContent = await zipEntry.async('text');
                console.log(`Processing HTML file: ${zipEntry.name}`);

                let modifiedContent = updateLinks(htmlContent, zipEntry.name);
                modifiedContent = updateVideoLinks(modifiedContent, zipEntry.name);
                modifiedContent = updateImageLinks(modifiedContent, zipEntry.name);

                // Adiciona o arquivo HTML modificado à raiz do novo arquivo zip
                zip.file(fileName, modifiedContent);
                modifiedHTMLFiles.push(fileName);

                console.log(`File ${zipEntry.name} processed and modified successfully.`);

            } else if (fileName.match(/\.(png|jpg|jpeg|bmp|gif)$/i)) {
                // Move arquivos PNG, JPG, BMP ou gif para a pasta 'img'
                const blob = await zipEntry.async('blob');
                imgFolder.file(fileName, blob);
                imgFolderName = 'imagem'; 
                
                // Exclui o arquivo original
                delete zip.files[zipEntry.name];
                //console.log(`Original file ${zipEntry.name} moved to 'img' folder.`);
            } else if (fileName.match(/\.(avi|mp4|m4v|mov|wmv)$/i)) {
                // Move arquivos de vídeo para a pasta 'video'
                const blob = await zipEntry.async('blob');
                videoFolder.file(fileName, blob);
                videoFolderName = 'video'; 
                
                // Exclui o arquivo original
                delete zip.files[zipEntry.name];
                //console.log(`Original video file ${zipEntry.name} moved to 'video' folder.`);
            } else if (fileName.match(/\.(bat|reg)$/i)) {
                // Move arquivos .bat e .reg para a pasta 'funcionalidades'
                const blob = await zipEntry.async('blob');
                funcFolder.file(fileName, blob);
                funcFolderName = 'funcionalidades'; 
                
                // Exclui o arquivo original
                delete zip.files[zipEntry.name];
                console.log(`Original script file ${zipEntry.name} moved to 'funcionalidades' folder.`);
            } else if (fileName.match(/\.(txt|pdf)$/i)) {
                // Move arquivos .txt e .pdf para a pasta 'documentos'
                const blob = await zipEntry.async('blob');
                docFolder.file(fileName, blob);
                docFolderName = 'documentos'; 
                
                // Exclui o arquivo original
                delete zip.files[zipEntry.name];
                console.log(`Original document file ${zipEntry.name} moved to 'documentos' folder.`);
            }
        })
    );

        // Move os arquivos HTML modificados para a raiz do zip
        for (const fileName of modifiedHTMLFiles) {
            const modifiedContent = await zip.file(fileName).async('text');

            // Adiciona o arquivo HTML modificado à raiz do novo arquivo zip
            zip.file(fileName, modifiedContent);

            // Remove o arquivo HTML original de todas as pastas
            for (const folder of Object.values(zip.files)) {
                if (!folder.dir && folder.name.endsWith(`/${fileName}`)) {
                    delete zip.files[folder.name];
                }
            }
        }

        // Chame a função processBootstrap passando o objeto zip e a lista de arquivos modificados
        await processBootstrap(zip, modifiedHTMLFiles);



        // Remove as pastas vazias
        const foldersToDelete = new Set();
        for (const [relativePath, zipEntry] of Object.entries(zip.files)) {
            if (zipEntry.dir && zip.folder(relativePath).length === 0) {
                foldersToDelete.add(relativePath);
            }
        }

        foldersToDelete.forEach(folder => delete zip.files[folder]);


    // Cria um novo arquivo zip com o conteúdo modificado
    await createZipFile(zip, imgFolderName, videoFolderName, funcFolderName, docFolderName);
}


function readZipFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function (e) {
            resolve(e.target.result);
        };

        reader.onerror = function (e) {
            reject(e);
        };

        reader.readAsArrayBuffer(file);
    });
}

async function createZipFile(zip, folderName) {
    // Cria um novo arquivo zip
    const blob = await zip.generateAsync({ type: 'blob' });

    // Cria um link temporário para download
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);

    // Define o nome do arquivo como 'newFiles.zip'
    link.download = `newFiles_${folderName}.zip`;

    // Adiciona o link ao corpo do documento
    document.body.appendChild(link);

    // Simula um clique no link para iniciar o download
    link.click();

    // Remove o link após o download
    document.body.removeChild(link);
}