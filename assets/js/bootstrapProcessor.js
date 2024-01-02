// bootstrapProcessor.js

export async function processBootstrap(zip, modifiedHTMLFiles) {
    // Adiciona Bootstrap 5 e modifica as TAGs
    const bootstrapLink = '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">';
    const jqueryScript = '<script src="https://code.jquery.com/jquery-3.6.0.slim.min.js"></script>';
    const bootstrapScript = '<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>';

    for (const fileName of modifiedHTMLFiles) {
        const modifiedContent = await zip.file(fileName).async('text');

        // Adiciona o Bootstrap 5 ao cabeçalho do HTML
        const modifiedHTML = modifiedContent.replace('</head>', `${bootstrapLink}\n</head>`);

        // Adiciona o jQuery e o Bootstrap 5 antes do fechamento do corpo do HTML
        const modifiedHTMLWithScripts = modifiedHTML.replace('</body>', `${jqueryScript}\n${bootstrapScript}\n</body>`);

        // Adiciona classes do Bootstrap às tags <p>, <ul>, e <li>
        const modifiedHTMLWithBootstrap = modifiedHTMLWithScripts
            .replace(/<p>/g, '<p class="mb-3">') // Adiciona classe mb-3 às tags <p>
            .replace(/<ul>/g, '<ul class="list-group">') // Adiciona classe list-group às tags <ul>
            .replace(/<li>/, '<li class="list-group-item list-group-item-action">') // Modifica apenas o primeiro <li>
            .replace(/<button>/g, '<button class="btn btn-primary">') // Adiciona classe btn e btn-primary às tags <button>
            .replace(/<form>/g, '<form class="form">') // Adiciona classe form às tags <form>
            .replace(/<nav>/g, '<nav class="navbar navbar-expand-lg navbar-light bg-light">') // Adiciona classes navbar, navbar-expand-lg, navbar-light e bg-light às tags <nav>
            .replace(/<table>/g, '<table class="table table-bordered">'); // Adiciona classes table e table-bordered às tags <table>

        // Atualiza o arquivo HTML no zip
        zip.file(fileName, modifiedHTMLWithBootstrap);
    }
}