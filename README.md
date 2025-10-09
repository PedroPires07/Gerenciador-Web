# Dicionário da Saúde — Admin (Firebase)

Admin web em React + TypeScript + Vite + Tailwind, integrado ao **Firebase Auth** e **Firestore**.
- Telas: Login, Criar Perfil, Dashboard, Termos (com modal de **Novo Termo**), Categorias (com modal de **Nova Categoria**), Usuários, Logs, Config.
- Sem dados mockados. Tudo carregado do Firestore.

## Rodando
```bash
npm i
cp .env.example .env.local  # preencha as chaves do Firebase
npm run dev
```

## Firestore (coleção esperadas)
- `profiles` (id = uid do usuário, campos: nome, email, role, ativo, ultimoAcesso)
- `categorias` (nome, area, totalTermos, criadoEm)
- `termos` (cientifico, populares: string[], area, categoria, status, atualizadoEm)
- `logs` (opcional)

## Regras (desenvolvimento)
Veja `firestore.rules`. Ajuste para papéis/produção.
