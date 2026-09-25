# Brilho Desenhos

Crie um app estilo Netflix ("Appflix") para desenhos animados infantis — uma plataforma de streaming de vídeos para crianças.

IDIOMA: Português (Brasil).

ESTRUTURA (igual Netflix/Disney+):
- Tela inicial com um banner grande em destaque no topo (desenho "em destaque", com título, descrição curta e botão "Assistir")
- Várias fileiras horizontais roláveis de cards, cada fileira uma categoria: "Continue Assistindo", "Desenhos em Alta", "Aventura", "Educativo", "Bichinhos e Animais", "Clássicos", "Curtinhas (até 5 min)"
- Cada card = thumbnail colorida do desenho + título, ao clicar abre um player de vídeo em modal/tela cheia
- Use uns 20-24 "desenhos" de exemplo (placeholder) distribuídos nas categorias acima, com títulos genéricos e fofos (tipo "O Foguete do Formiguinha", "A Ilha dos Bichinhos"), com capas geradas em estilo "claymation"/stop-motion, coloridas e cinematográficas, sem texto/logos nas imagens

PLAYER DE VÍDEO (importante):
- Suporte a vídeo do YouTube incorporado via iframe oficial, usando parâmetros discretos: controls=0 (esconda a barra nativa do YouTube e construa botões de play/pause/progresso próprios por cima), rel=0 (sem sugestões de outros vídeos ao final), modestbranding=1. NÃO tente remover ou bloquear cliques na marca/atribuição do YouTube — apenas minimize a exposição visual dela usando os parâmetros oficiais da API.
- Suporte também a arquivo de vídeo direto (tag <video>) como alternativa, com a estrutura de dados pronta pra eu trocar por links reais depois (ainda não tenho os vídeos definitivos, pode usar "Em breve" ou vídeos de exemplo livres/creative commons como placeholder).

LAYOUT MOBILE-FIRST (muito importante):
- No celular: barra de navegação inferior fixa (tipo app nativo) com ícones para "Início", "Buscar", "Categorias", "Perfil" — a navegação principal fica nessa barra, não no menu de cima.
- Header do celular compacto: só logo + busca + perfil.
- Cards em carrossel horizontal com scroll suave por toque, botões e áreas de toque grandes o suficiente pro dedo.
- Testado e funcionando bem em larguras de 360-430px.
- No desktop, pode manter o menu superior tradicional como fileira principal de navegação.

INSTALAÇÃO NO CELULAR (PWA):
- manifest.json com ícone e nome "Appflix", cores combinando com o tema.
- Service worker básico pra funcionar como app instalável.
- Botão visível "Baixar app" / "Instalar" (com ícone de download) que dispara o prompt nativo de instalação no Android/Chrome (beforeinstallprompt).
- Para iPhone/Safari (que não tem esse prompt automático), detecte o navegador e mostre um mini tutorial "Toque em Compartilhar > Adicionar à Tela de Início".

VISUAL:
- Estética Netflix clássica: fundo bem escuro (quase preto), cards com cantos arredondados, efeito de destaque/zoom suave ao passar o mouse, cor de destaque vermelho/laranja vibrante.
- Tipografia moderna, arredondada mas não boba. Sem gradientes exagerados nem excesso de emoji.

Não precisa de login, banco de dados nem backend — é só uma vitrine/catálogo por enquanto. Implemente tudo de uma vez, sem pausar pra aprovação de plano. Me diga o preview_url quando terminar.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/243fc662-9a9e-44bb-9238-dbb6b93f21b1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
