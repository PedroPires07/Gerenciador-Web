# Gerenciador Web - Dicionário da Saúde

Sistema de gerenciamento de termos médicos e odontológicos desenvolvido com React + TypeScript + Vite + Tailwind, integrado ao Firebase.

## 🚀 Configuração do Projeto

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Conta no Firebase

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/PedroPires07/Gerenciador-Web.git
cd Gerenciador-Web
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
   - Copie o arquivo `.env.example` para `.env.local`
   - Preencha com suas credenciais do Firebase

```bash
cp .env.example .env.local
```

4. Configure o Firebase Admin (opcional, para funcionalidades administrativas):
   - Baixe o arquivo `serviceAccountKey.json` do Firebase Console
   - Coloque na raiz do projeto
   - **IMPORTANTE**: Este arquivo nunca deve ser commitado no Git

### Executando o projeto

```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173`

## 📁 Estrutura do Projeto

```
├── src/
│   ├── components/      # Componentes reutilizáveis (Layout, Sidebar, etc.)
│   ├── data/           # Modelos e repositórios de dados
│   ├── hooks/          # Hooks customizados (useAuth)
│   ├── integrations/   # Integrações externas (Firebase)
│   ├── pages/          # Páginas da aplicação
│   ├── styles/         # Estilos globais
│   └── types/          # Definições de tipos TypeScript
├── scripts/            # Scripts utilitários
└── firestore.rules     # Regras de segurança do Firestore
```

## 🗄️ Estrutura do Firestore

O projeto utiliza as seguintes coleções:

- **profiles**: Perfis de usuários (nome, email, role, ativo, ultimoAcesso)
- **categorias**: Categorias de termos (nome, area, totalTermos, criadoEm)
- **termos**: Termos médicos/odontológicos (cientifico, populares, area, categoria, status, atualizadoEm)
- **logs**: Logs de atividades (opcional)

## 🔒 Segurança

**IMPORTANTE**: Os seguintes arquivos contêm dados sensíveis e **NUNCA** devem ser commitados:

- `.env.local` - Variáveis de ambiente com credenciais do Firebase
- `serviceAccountKey.json` - Chave de serviço do Firebase Admin

Esses arquivos já estão incluídos no `.gitignore`.

### Configuração de Permissões

As regras do Firestore (`firestore.rules`) estão configuradas para:
- Permitir leitura pública de termos e categorias (para app mobile)
- Restringir escrita apenas para usuários com role `admin` ou `moderador`
- Proteger perfis de usuários

## 🎨 Tema de Cores

O sistema utiliza a cor primária `#2D1C87` (roxo escuro) para elementos de destaque, botões e links.

## 📱 Integração com App Mobile

Este gerenciador web serve como backend para o aplicativo mobile, permitindo que:
- Usuários com role `viewer` façam login no app mobile
- Administradores gerenciem termos e categorias pelo painel web
- Dados sejam sincronizados em tempo real via Firestore

## 📝 Licença

Este projeto é privado e de uso exclusivo da equipe.
