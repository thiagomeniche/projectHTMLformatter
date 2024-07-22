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
 
        // Adiciona classes do Bootstrap às tags <p>, <ul>, <li>, etc.
        let modifiedHTMLWithBootstrap = modifiedHTMLWithScripts
            .replace(/<p>/g, '<p class="mb-3">') // Adiciona classe mb-3 às tags <p>
            .replace(/<ul>/g, '<ul class="list-group">') // Adiciona classe list-group às tags <ul>
            .replace(/<li>/, '<li class="list-group-item list-group-item-action">') // Modifica apenas o primeiro <li>
            .replace(/<button>/g, '<button class="btn btn-primary">') // Adiciona classe btn e btn-primary às tags <button>
            .replace(/<form>/g, '<form class="form">') // Adiciona classe form às tags <form>
            .replace(/<nav>/g, '<nav class="navbar navbar-expand-lg navbar-light bg-light">') // Adiciona classes navbar, navbar-expand-lg, navbar-light e bg-light às tags <nav>
            .replace(/<table>/g, '<table class="table table-bordered">') // Adiciona classes table e table-bordered às tags <table>
            .replace(/<h1>/g, '<h1 class="display-4">') // Adiciona classe display-4 às tags <h1>
            .replace(/<h2>/g, '<h2 class="display-5">') // Adiciona classe display-5 às tags <h2>
            .replace(/<h3>/g, '<h3 class="display-6">') // Adiciona classe display-6 às tags <h3>
            .replace(/<blockquote>/g, '<blockquote class="blockquote">') // Adiciona classe blockquote às tags <blockquote>
            .replace(/<figcaption>/g, '<figcaption class="blockquote-footer">') // Adiciona classe blockquote-footer às tags <figcaption>
            .replace(/<img>/g, '<img class="img-fluid">') // Adiciona classe img-fluid às tags <img>
            .replace(/<hr>/g, '<hr class="my-4">') // Adiciona classe my-4 às tags <hr>
            .replace(/<footer>/g, '<footer class="footer mt-auto py-3 bg-light">') // Adiciona classes footer, mt-auto, py-3 e bg-light às tags <footer>
            .replace(/<div>/g, '<div class="container">') // Adiciona classe container às tags <div>
            .replace(/<section>/g, '<section class="row">') // Adiciona classe row às tags <section>
            .replace(/<article>/g, '<article class="col-md-6 col-lg-4 mb-4">'); // Adiciona classes col-md-6, col-lg-4, e mb-4 às tags <article>
 
        // Adiciona um exemplo de modal
        const modalHTML = `
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                This is a Bootstrap modal example.
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Save changes</button>
              </div>
            </div>
          </div>
        </div>`;
 
        modifiedHTMLWithBootstrap = modifiedHTMLWithBootstrap.replace('</body>', `${modalHTML}\n</body>`);
 
        // Atualiza o arquivo HTML no zip
        zip.file(fileName, modifiedHTMLWithBootstrap);
     }
 }