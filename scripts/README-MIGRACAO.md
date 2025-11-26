# Script de Migração - Adicionar Campo Descrição

Este script adiciona o campo `descricao` a todos os termos existentes no Firestore.

## Como Executar

### Opção 1: Usando Firebase Admin SDK (Recomendado)

1. Certifique-se de que o arquivo `serviceAccountKey.json` está na raiz do projeto

2. Execute o script:
```bash
node scripts/adicionar-descricao-termos.js
```

### Opção 2: Usando Firebase Client SDK

1. Certifique-se de que o arquivo `.env.local` está configurado corretamente

2. Execute o script:
```bash
node scripts/adicionar-descricao-termos.mjs
```

## O que o script faz?

- Busca todos os documentos na coleção `termos`
- Adiciona o campo `descricao: ''` (vazio) aos termos que não possuem esse campo
- Ignora termos que já possuem o campo `descricao`
- Mostra um relatório ao final com:
  - Quantidade de termos atualizados
  - Quantidade de termos que já tinham descrição
  - Quantidade de erros (se houver)

## Segurança

⚠️ **IMPORTANTE**: 
- Faça backup do seu Firestore antes de executar scripts de migração
- Teste primeiro em um ambiente de desenvolvimento
- O script não remove nem modifica dados existentes, apenas adiciona o novo campo

## Estrutura do Campo

```typescript
interface Termo {
  id: string
  cientifico: string
  populares: string[]
  descricao?: string  // ← NOVO CAMPO
  area: 'Medicina' | 'Odontologia'
  categoria: string
  status: 'Verificado' | 'Pendente'
  atualizadoEm: string
}
```

## Exemplo de Uso após Migração

Após executar o script, você poderá:
- Adicionar descrições aos novos termos
- Editar termos existentes para incluir descrições
- O campo aceita texto livre e é opcional
