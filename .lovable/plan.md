# Plano — Appflix em formato de aplicativo móvel

## Resultado
Transformar toda a experiência em uma única coluna de até 430 px, centralizada em telas maiores, preservando catálogo, player, instalação PWA e publicação no GitHub Pages.

## Interface
- Remover a apresentação e navegação exclusivas de desktop.
- Criar cabeçalho com “Seu cantinho de desenhos”, saudação e contador de 24 desenhos.
- Criar destaque principal com capa, etiqueta, título, descrição e botão “Assistir agora”.
- Exibir categorias em grade de duas colunas, com capa, quantidade de episódios e botão de reprodução.
- Organizar “Continue assistindo” e “Todos os desenhos” no mesmo padrão compacto.
- Manter uma barra inferior fixa com Início, Categorias e Perfil, ativa dentro da coluna.
- Aplicar fundo azul-marinho, cartões azul-escuro, destaque dourado/laranja, títulos serifados e textos sans.

## Telas e interações
- Alternar dentro do aplicativo entre Início, lista de uma categoria, detalhe de um desenho e Perfil.
- Abrir o detalhe ao tocar em um card e iniciar o player pelo botão de reprodução.
- Manter os controles próprios do player e as fontes YouTube/vídeo direto atuais.
- Levar “Instalar app” para Perfil e manter um convite discreto na tela inicial, incluindo instruções no iPhone.

## Compatibilidade e validação
- Preservar PWA, manifesto, service worker e base `/brilho-desenhos/` do GitHub Pages.
- Verificar visualmente em 390 px e desktop, inclusive navegação, detalhe, perfil e player.
- Executar o build local de GitHub Pages e confirmar `index.html`, `404.html`, manifesto, ícones e service worker na pasta publicada.
