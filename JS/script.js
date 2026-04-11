const inputBusca = document.getElementById('inputBusca');
const caixaSugestoes = document.getElementById('caixaSugestoes');
const areaResultado = document.getElementById('areaResultado');
const listaFavoritos = document.getElementById('listaFavoritos');
const listaTopAnimes = document.getElementById('listaTopAnimes');

/**
 * Sanitiza o texto para evitar quebra de HTML com aspas.
 */
const sanitizar = (texto) => texto ? texto.replace(/'/g, "\\'") : "Sem Título";

/**
 * Busca e renderiza os Animes Mais Populares com a nota.
 */
async function carregarTopAnimes() {
    try {
        const resposta = await fetch('https://api.jikan.moe/v4/top/anime?limit=8');
        const json = await resposta.json();
        
        // Proteção caso a API negue o acesso por excesso de atualizações (Rate Limit)
        if (!json.data) {
            listaTopAnimes.innerHTML = '<p style="opacity:0.5;">Aguarde um momento e recarregue a página...</p>';
            return;
        }
        
        listaTopAnimes.innerHTML = json.data.map(anime => {
            const nota = anime.score || 'N/A';
            
            return `
            <div class="card-top" onclick="buscarAnimeSelecionado('${sanitizar(anime.title)}')">
                <div class="card-top-nota">⭐ ${nota}</div>
                <img src="${anime.images.jpg.large_image_url}" alt="Capa">
                <p title="${anime.title}">${anime.title}</p>
            </div>
            `;
        }).join('');
    } catch (erro) {
        listaTopAnimes.innerHTML = '<p>Erro ao carregar os top animes.</p>';
        console.error(erro);
    }
}

/**
 * Evento de digitação para Sugestões (Live Search).
 */
inputBusca.addEventListener('input', async () => {
    const termo = inputBusca.value.trim();
    if (termo.length < 3) { caixaSugestoes.innerHTML = ''; return; }
    
    try {
        const resposta = await fetch(`https://api.jikan.moe/v4/anime?q=${termo}&limit=5`);
        const { data } = await resposta.json();
        caixaSugestoes.innerHTML = data.map(anime => `
            <div class="sugestao-item" onclick="buscarAnimeSelecionado('${sanitizar(anime.title)}')">
                ${anime.title}
            </div>
        `).join('');
    } catch (erro) { console.error(erro); }
});

/**
 * Evento de Formulário.
 */
document.getElementById('formBusca').addEventListener('submit', (evento) => {
    evento.preventDefault();
    buscarAnimeSelecionado(inputBusca.value);
});

/**
 * Busca dados do anime e exibe o Card Principal com Sinopse Inteira.
 */
async function buscarAnimeSelecionado(nomeAnime) {
    caixaSugestoes.innerHTML = '';
    inputBusca.value = nomeAnime;
    
    try {
        const resposta = await fetch(`https://api.jikan.moe/v4/anime?q=${nomeAnime}&limit=1`);
        const { data } = await resposta.json();
        
        if (data && data.length > 0) {
            const anime = data[0];
            const tituloSeguro = sanitizar(anime.title);
            const capa = anime.images.jpg.large_image_url;
            const nota = anime.score || 'N/A';
            const sinopseCompleta = anime.synopsis ? anime.synopsis : 'Sinopse indisponível no momento.';
            const linkTraducao = `https://translate.google.com/?sl=en&tl=pt&text=${encodeURIComponent(sinopseCompleta)}&op=translate`;
            const linkAssistir = `https://www.crunchyroll.com/search?q=${encodeURIComponent(anime.title)}`;

            areaResultado.innerHTML = `
                <div class="card-destaque">
                    <img src="${capa}" alt="Capa">
                    <div class="info-destaque">
                        <h2>${anime.title}</h2>
                        <div><span class="nota-badge">⭐ Nota: ${nota}</span></div>
                        
                        <div class="sinopse-box">
                            <p>${sinopseCompleta}</p>
                            <a href="${linkTraducao}" target="_blank" class="btn-traduzir">🌍 Traduzir Sinopse</a>
                        </div>

                        <div id="feedbackSalvar"></div>

                        <a href="${linkAssistir}" target="_blank" class="btn-principal btn-assistir" style="width: 100%; padding: 20px; margin-bottom: 15px; text-decoration: none; display: flex; justify-content: center;">
                        📺 ASSISTIR NA CRUNCHYROLL
                         </a>
                        <button class="btn-principal btn-grande" style="width: 100%; padding: 20px;" id="btnSalvarFav" onclick="salvarAnime('${tituloSeguro}', '${capa}', '${nota}')">
                            ADICIONAR AOS FAVORITOS
                        </button>
                    </div>
                </div>
            `;
            // Aguarda um pequeno instante para garantir que o HTML do resultado já carregou na tela
setTimeout(() => {
    // Procura o card onde a sinopse e a imagem aparecem
    const cardResultado = document.querySelector('.card-destaque'); 
    
    // Se o card existir, a página desliza suavemente até ele
    if (cardResultado) {
        cardResultado.scrollIntoView({ 
            behavior: 'smooth', // Deixa o deslizamento suave
            block: 'center'     // Centraliza o card na tela
        });
    }
}, 100); // 100 milissegundos de atraso é suficiente
        } else { abrirModal(); }
    } catch (erro) { abrirModal(); }
}


/**
 * Salva no LocalStorage.
 */
function salvarAnime(titulo, capa, nota) {
    let favoritos = JSON.parse(localStorage.getItem('meusAnimesPremium')) || [];
    if (!favoritos.find(item => item.titulo === titulo)) {
        favoritos.push({ titulo, capa, nota });
        localStorage.setItem('meusAnimesPremium', JSON.stringify(favoritos));
        
        document.getElementById('feedbackSalvar').innerHTML = "<p style='color:#2ecc71; margin-bottom:15px; font-weight:bold; font-size:1.2rem;'>✅ Salvo na lista!</p>";
        document.getElementById('btnSalvarFav').style.display = 'none';
        renderizarFavoritos();
    }
}

/**
 * Renderiza os favoritos como Cards em Grid.
 */
function renderizarFavoritos() {
    const favoritos = JSON.parse(localStorage.getItem('meusAnimesPremium')) || [];
    listaFavoritos.innerHTML = '';

    if (favoritos.length === 0) {
        listaFavoritos.innerHTML = '<p style="grid-column:1/-1; text-align:center; opacity:0.5;">Sua lista está vazia.</p>';
        return;
    }

    listaFavoritos.innerHTML = favoritos.map(anime => `
        <div class="card-fav">
            <div class="card-fav-nota">⭐ ${anime.nota}</div>
            <img src="${anime.capa}" alt="Capa" onclick="buscarAnimeSelecionado('${sanitizar(anime.titulo)}')">
            <div class="card-fav-footer">
                <span class="card-fav-nome" title="${anime.titulo}">${anime.titulo}</span>
                <button class="btn-lixeira" onclick="removerAnime('${sanitizar(anime.titulo)}')">🗑️</button>
            </div>
        </div>
    `).join('');
}

/**
 * Remove o anime pelo título.
 */
/**
 * Remove o anime pelo título após confirmação do usuário.
 */
function removerAnime(titulo) {
    // 1. Puxa os elementos do nosso Modal HTML
    const modal = document.getElementById('modalConfirmacao');
    const textoConfirmacao = document.getElementById('textoConfirmacao');
    const btnConfirmar = document.getElementById('btnConfirmar');
    const btnCancelar = document.getElementById('btnCancelar');

    // 2. Coloca o nome do anime no texto da caixa
    textoConfirmacao.innerText = `Tem certeza que deseja remover "${titulo}" da sua lista de favoritos?`;
    
    // 3. Faz o modal aparecer na tela
    modal.style.display = 'flex';

    // 4. O que acontece se clicar em "Sim, tenho." (Confirmar)
    btnConfirmar.onclick = function() {
        // Sua lógica original intacta aqui:
        let favoritos = JSON.parse(localStorage.getItem('meusAnimesPremium')) || [];
        favoritos = favoritos.filter(anime => anime.titulo !== titulo);
        localStorage.setItem('meusAnimesPremium', JSON.stringify(favoritos));
        renderizarFavoritos();
        
        // Esconde o modal depois de deletar
        modal.style.display = 'none'; 
    };

    // 5. O que acontece se clicar em "Melhor não." (Cancelar)
    btnCancelar.onclick = function() {
        // Apenas esconde o modal, nada acontece com o anime
        modal.style.display = 'none'; 
    };
}

/** Controle do Modal Anya */
function abrirModal() { document.getElementById('modalAnya').style.display = 'flex'; }
function fecharModal() { document.getElementById('modalAnya').style.display = 'none'; }

// Inicialização
carregarTopAnimes();
renderizarFavoritos();