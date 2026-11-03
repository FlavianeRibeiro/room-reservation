# SALA-1: Listagem e Filtro de Salas

Esta branch implementa a exibição das salas disponíveis na aplicação com suporte a filtros dinâmicos integrados à URL.

## O que foi implementado

- **Página de salas**: Exibição em grade com nome, capacidade e recursos disponíveis.
- **Filtros por URL**: Filtragem por capacidade mínima e por recursos específicos mantida diretamente na barra de endereços (query params), permitindo compartilhamento do link.
- **Validação de entradas**: Tratamento dos parâmetros da URL para evitar comportamentos inesperados ao inserir dados inválidos.
- **Testes dedicados**: Cobertura das regras de busca e filtros de salas.
