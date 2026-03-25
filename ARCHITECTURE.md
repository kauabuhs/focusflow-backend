# 🏗️ Arquitetura Backend - FocusFlow

## Visão Geral

Backend estruturado em **arquitetura em camadas** com separação de concerns e princípios de DDD (Domain-Driven Design).

```
API Request → Middleware → Controller → Service → Repository → Database
```

## Estrutura de Pastas

### `/api` - Camada de Apresentação
Responsável por receber requisições HTTP e enviar respostas.

```
api/
├── routes/           # Definição de rotas (Express)
├── controllers/      # Controllers - tratam requisições e delegam para services
└── middleware/       # Middlewares (auth, validação, erro)
```

**Responsabilidades:**
- Validar entrada de dados
- Chamar serviços
- Formatar resposta
- Tratar status HTTP

---

### `/application` - Camada de Aplicação
Lógica de negócio da aplicação.

```
application/
└── services/         # Services - orquestram regras de negócio
```

**Responsabilidades:**
- Implementar casos de uso
- Orquestrar múltiplos repositórios
- Implementar regras de negócio
- Tratamento de exceções

**Exemplo:**
```typescript
// CreateTaskService
- Validar entrada
- Chamar TaskRepository
- Chamar NotificationService
- Retornar resultado
```

---

### `/domain` - Camada de Domínio
Entidades e interfaces que definem o negócio.

```
domain/
├── entities/         # Classes de domínio (Task, User, Project)
└── interfaces/       # Contratos/Interfaces (ITaskRepository)
```

**Responsabilidades:**
- Definir entidades do domínio
- Definir contratos (interfaces)
- Validações de domínio
- Regras imutáveis do negócio

---

### `/infrastructure` - Camada de Infraestrutura
Implementações técnicas e acesso a dados.

```
infrastructure/
├── persistence/
│   └── repositories/  # Implementações de repositórios (Prisma)
└── config/           # Configurações (Database, Logger)
```

**Responsabilidades:**
- Implementar repositórios
- Gerenciar conexão com DB
- Implementar serviços externos
- Configurações técnicas

---

### `/shared` - Código Compartilhado
Utilitários e tipos usados por todas as camadas.

```
shared/
├── types/            # Tipos TypeScript genéricos
├── constants/        # Enums, constantes
├── utils/            # Funções auxiliares
├── errors/           # Classes de erro customizadas
├── validators/       # Validação de dados
└── decorators/       # Decoradores TypeScript
```

---

### `/docs` - Documentação
```
docs/
└── openapi/          # Especificação OpenAPI/Swagger
```

---

## Fluxo de Requisição

### Exemplo: Criar Tarefa

```
1. POST /api/tasks (HTTP Request)
   ↓
2. Router recebe (routes/task.routes.ts)
   ↓
3. Middleware valida (auth, body validation)
   ↓
4. Controller executa (controllers/TaskController)
   - Validar input
   - Chamar service
   ↓
5. Service processa (services/CreateTaskService)
   - Aplicar regras de negócio
   - Chamar repositórios
   ↓
6. Repository acessa dados (repositories/TaskRepository)
   - Usar Prisma
   - Retornar dado
   ↓
7. Service retorna resultado
   ↓
8. Controller formata resposta
   ↓
9. Response HTTP enviada
```

---

## Padrões Utilizados

### Repository Pattern
```typescript
// domain/interfaces/ITaskRepository.ts
interface ITaskRepository {
  create(data: CreateTaskDTO): Promise<Task>;
  findById(id: string): Promise<Task | null>;
  update(id: string, data: UpdateTaskDTO): Promise<Task>;
  delete(id: string): Promise<void>;
}

// infrastructure/persistence/repositories/TaskRepository.ts
export class TaskRepository implements ITaskRepository {
  // Implementação com Prisma
}
```

### Service/Use Case Pattern
```typescript
// application/services/CreateTaskService.ts
export class CreateTaskService {
  constructor(private taskRepository: ITaskRepository) {}
  
  async execute(input: CreateTaskDTO): Promise<Task> {
    // Validar
    // Chamar repositório
    // Retornar
  }
}
```

### Dependency Injection
```typescript
// Colocar em um container de DI para injetar dependências
const taskRepository = new TaskRepository();
const createTaskService = new CreateTaskService(taskRepository);
```

---

## Convenções

### Nomes de Arquivos
- **Controllers**: `TaskController.ts` (Singular, PascalCase)
- **Services**: `CreateTaskService.ts` (Verbo + Nome, PascalCase)
- **Repositories**: `TaskRepository.ts` (Nome + Repository)
- **Entities**: `Task.ts` (Singular, PascalCase)
- **Interfaces**: `ITaskRepository.ts` (I + Nome)
- **DTOs**: `CreateTaskDTO.ts` (Verbo + Nome + DTO)

### Estrutura de Pastas por Feature
```
features/task/
├── controllers/TaskController.ts
├── services/CreateTaskService.ts
├── entities/Task.ts
├── interfaces/ITaskRepository.ts
└── repositories/TaskRepository.ts
```

---

## Dependências entre Camadas

```
API → Application → Domain ← Infrastructure
      ↓
    Shared (Types, Errors, Utils)
```

**Regra:** Cada camada só depende de camadas abaixo dela.

---

## Próximos Passos

1. Implementar controllers em `/api/controllers`
2. Criar services em `/application/services`
3. Definir entidades em `/domain/entities`
4. Implementar repositórios em `/infrastructure/persistence/repositories`
5. Criar tipos em `/shared/types`
6. Documentar API em `/docs/openapi`

