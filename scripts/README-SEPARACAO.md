# Scripts de Separação de Termos

Scripts para classificar e separar termos científicos de termos populares no Firestore.

## Scripts Disponíveis

### 1. Analisar e Separar Termos (Relatório)

**Arquivo:** `separar-termos.js`

Analisa todos os termos e gera um relatório detalhado separando em:
- **Científicos Puros**: Termos que possuem apenas nome científico
- **Populares Puros**: Termos que possuem apenas nomes populares
- **Mistos**: Termos que possuem tanto nome científico quanto populares

**Como executar:**
```bash
node scripts/separar-termos.js
```

**O que faz:**
- Lista todos os termos de cada categoria
- Mostra estatísticas detalhadas
- Exporta os dados para `scripts/termos-separados.json`

**Saída esperada:**
```
📊 RESUMO ESTATÍSTICO
🔬 Termos Científicos Puros: X
💬 Termos Populares Puros: Y
🔀 Termos Mistos: Z
📦 Total: N
```

---

### 2. Adicionar Campo "tipo" aos Termos

**Arquivo:** `adicionar-tipo-termos.js`

Adiciona um campo `tipo` a cada termo no Firestore para facilitar a filtragem.

**Como executar:**
```bash
node scripts/adicionar-tipo-termos.js
```

**O que faz:**
- Analisa cada termo e adiciona o campo `tipo`:
  - `'cientifico'` - termo tem apenas nome científico
  - `'popular'` - termo tem apenas nomes populares
  - `'misto'` - termo tem ambos
- Atualiza o Firestore em batch
- Gera relatório de quantos termos foram atualizados

---

## Estrutura Atualizada do Termo

Após executar os scripts, cada termo terá:

```typescript
interface Termo {
  id: string
  cientifico: string
  populares: string[]
  descricao?: string
  tipo: 'cientifico' | 'popular' | 'misto'  // ← NOVO
  area: 'Medicina' | 'Odontologia'
  categoria: string
  status: 'Verificado' | 'Pendente'
  atualizadoEm: string
}
```

---

## Como Usar o Campo "tipo"

### Filtrar por tipo no código:

```typescript
// Buscar apenas termos científicos
const cientificos = termos.filter(t => t.tipo === 'cientifico');

// Buscar apenas termos populares
const populares = termos.filter(t => t.tipo === 'popular');

// Buscar termos mistos
const mistos = termos.filter(t => t.tipo === 'misto');
```

### Consulta no Firestore:

```typescript
// Buscar termos científicos
const cientificosRef = collection(db, 'termos').where('tipo', '==', 'cientifico');

// Buscar termos populares
const popularesRef = collection(db, 'termos').where('tipo', '==', 'popular');
```

---

## Ordem de Execução Recomendada

1. **Primeiro:** Execute `separar-termos.js` para ver o relatório
   ```bash
   node scripts/separar-termos.js
   ```

2. **Depois:** Execute `adicionar-tipo-termos.js` para atualizar o Firestore
   ```bash
   node scripts/adicionar-tipo-termos.js
   ```

3. **Revisar:** Verifique o arquivo `scripts/termos-separados.json` gerado

---

## Segurança

⚠️ **IMPORTANTE**: 
- Faça backup do seu Firestore antes de executar o script de atualização
- Teste primeiro em um ambiente de desenvolvimento
- O script de análise (`separar-termos.js`) apenas lê dados, não modifica nada
- O script de atualização (`adicionar-tipo-termos.js`) adiciona um novo campo sem remover dados existentes

---

## Arquivo Exportado

O script `separar-termos.js` gera um arquivo `termos-separados.json` com a estrutura:

```json
{
  "cientificos": [...],
  "populares": [...],
  "mistos": [...]
}
```

Este arquivo pode ser usado para:
- Análise offline
- Importação em outras ferramentas
- Backup dos dados classificados
