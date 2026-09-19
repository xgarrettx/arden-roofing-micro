# NestJS Backend Guidelines for Claude

Use these guidelines when building a NestJS backend. Follow these patterns and conventions consistently.

## Stack

- **Framework**: NestJS with Express
- **Language**: TypeScript (strict)
- **Database**: MySQL with TypeORM
- **Cache/Sessions**: Redis via `cache-manager-redis-store`
- **Auth**: Passport (session-based) with Redis-backed sessions
- **Validation**: `class-validator` + `class-transformer`
- **Env validation**: Joi
- **Date/time**: Luxon (never raw `Date`)
- **Decimal math**: `decimal.js` (never floating point for money)

## Project Structure

```
src/
├── app.module.ts             # Root module
├── main.ts                   # Server bootstrap
├── env.configs.ts            # Joi env schema + Config object
├── global/                   # Shared cross-cutting concerns
│   ├── decorators/           # Custom decorators (@Public, role decorators, param extractors)
│   ├── guards/               # Auth and authorization guards
│   ├── middleware/           # Request processors
│   ├── interceptors/         # Logging, error reporting
│   ├── exceptions/           # Exception classes + global filter
│   ├── dtos/                 # Shared DTOs (pagination)
│   ├── enums/                # Global enums
│   ├── db/                   # DB utilities, types
│   ├── migrations/           # TypeORM migrations
│   ├── utils/                # Date, math, general utilities
│   ├── consts.ts             # Global constants
│   └── helpers/              # Env helpers, pagination helpers
├── auth/                     # Auth module (strategies, guards, session DTOs)
├── user/                     # Example feature module
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── entities/
│   ├── dto/
│   └── user.module.ts
└── [feature]/                # Each feature follows the same shape
```

Each feature module is self-contained with its own entities, services, repositories, controllers, and DTOs.

## Module Pattern

```typescript
@Module({
  imports: [
    TypeOrmModule.forFeature([MyEntity]),
    forwardRef(() => OtherModule),   // Use forwardRef for circular deps
    DirectModule,
  ],
  controllers: [MyController],
  providers: [MyService, MyRepository],
  exports: [MyService],              // Export services, NOT repositories
})
export class MyModule {}
```

- Repositories stay private to the module.
- Only export services that other modules need.
- Use `forwardRef(() => Module)` at the module level for circular dependencies.

## Entity Pattern

```typescript
@Entity('orders')
export class Order {
  @PrimaryColumn('bigint', { transformer: [number], generated: true })
  id: number

  @Column()
  name: string

  @Column('bigint', { transformer: [number] })
  user_id: number

  @Column('decimal', { transformer: [number] })
  amount: number

  @Column('timestamp', { transformer: [timestamp] })
  created_at: number

  @Column('timestamp', { transformer: [timestamp] })
  updated_at?: number

  @DeleteDateColumn({ type: 'timestamp', transformer: [timestamp] })
  deleted_at?: number
}
```

- **Entity properties use snake_case**, matching the database columns directly. Do NOT use `SnakeNamingStrategy` or any automatic case conversion.
- Use `bigint` with a `number` transformer for IDs and foreign keys (converts DB strings to JS numbers).
- Use `decimal` with a `number` transformer for financial values.
- **Timestamps use MySQL `TIMESTAMP(3)`** for readability with millisecond precision. Use a `timestamp` transformer that:
  - **to DB**: converts epoch milliseconds to a SQL datetime string via Luxon
  - **from DB**: converts the JS `Date` back to epoch milliseconds via `DateTime.fromJSDate(val).toMillis()`
- In code, timestamps are still handled as **epoch milliseconds (numbers)**.
- Use `@DeleteDateColumn({ type: 'timestamp', transformer: [timestamp] })` for soft deletes.

## Repository Pattern

```typescript
@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(Order) private repository: Repository<Order>,
  ) {}

  async findById(id: number) {
    const res = await this.repository.findOne({ where: { id } })
    if (!res) throw new NotFoundException('Order not found')
    return res
  }

  async findByUser(userId: number, pagination: CursorPaginationReqDto) {
    // Use query builder for joins and complex queries
    return this.repository.createQueryBuilder('o')
      .where('o.user_id = :userId', { userId })
      .orderBy('o.id', 'DESC')
      .take(pagination.page_size)
      .getMany()
  }
}
```

- Repositories wrap TypeORM's `Repository<Entity>` and are the **only** layer that talks to the database.
- Consider throwing `NotFoundException` when a record lookup fails.
- Use `findOne`/`find` for simple lookups, query builder for joins and complex queries.
- Consider creating a `BaseRepository<Entity>` with common methods (`findOneById`, `findByCriteria`, `updateById`, `deleteById`, etc.) to avoid repeating standard CRUD logic in every repository. When a query pattern repeats across multiple repos, promote it to the base class.

## Service Pattern

```typescript
@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    @Inject(forwardRef(() => PaymentService))
    private paymentService: PaymentService,
  ) {}

  findById(id: number) {
    return this.orderRepository.findById(id)
  }

  async create(dto: CreateOrderDto, userId: number) {
    // Business logic here, delegate data access to repository
  }
}
```

- Use `@Inject(forwardRef(() => Service))` for circular service dependencies.
- Services contain business logic. Never query the DB directly from a service.
- Organize methods by operation: FIND, CREATE, UPDATE, DELETE.

## Controller Pattern

```typescript
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  findAll(@Query() paginationDto: CursorPaginationReqDto) {
    return this.orderService.findAll(paginationDto)
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findById(id)
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateOrderDto) {
    return this.orderService.create(createDto)
  }
}
```

- Use `ParseIntPipe` for numeric URL params.
- Controllers should be thin - delegate all logic to services.
- Use custom decorators to extract auth info from the request (user ID, roles, etc.) instead of accessing `req.user` directly.
- Mark public routes with a `@Public()` decorator that skips auth guards.

## DTO Pattern

```typescript
// Input DTO (validation)
export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  amount: number

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto
}

// Output DTO (response shaping)
export class OrderResponseDto {
  id: number
  name: string
  amount: number
  status: string

  static build(entity: Order): OrderResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      amount: entity.amount,
      status: entity.status,
    }
  }

  static buildAll(entities: Order[]): OrderResponseDto[] {
    return entities.map(e => this.build(e))
  }
}
```

- Use `class-validator` decorators for all input DTOs.
- Use static `build()` and `buildAll()` methods on output DTOs for entity-to-DTO mapping.
- Use `@Type(() => NestedDto)` with `@ValidateNested()` for nested objects.
- API field names use **snake_case** (e.g., `page_size`, `first_name`).

## Auth & Guards

### Guard Hierarchy (global, applied in order)
1. **AuthGuard** - Validates the session/token. Skipped for routes marked `@Public()`.
2. **RolesGuard** - Checks role metadata set by role decorators.

### Decorator Patterns

```typescript
// Mark route as public (skip auth)
export const Public = () => SetMetadata('skipAuth', true)

// Role enforcement
export const Roles = (...roles: string[]) => SetMetadata('roles', roles)
export const AdminOnly = () => Roles('admin')

// Parameter extraction (avoid raw req.user in controllers)
export const CurrentUserId = createParamDecorator((_, ctx) => {
  return ctx.switchToHttp().getRequest().user.id
})
```

Register guards globally via `APP_GUARD` in your root module, not per-controller.

## Error Handling

Register a global `@Catch()` exception filter that normalizes error responses:

```typescript
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        message: exception.message,
      })
    } else if (exception instanceof QueryFailedError) {
      response.status(HttpStatus.BAD_REQUEST).json({
        message: 'Database query failed',
      })
    } else {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error',
      })
    }
  }
}
```

- Register as `{ provide: APP_FILTER, useClass: GlobalExceptionFilter }` in the root module.
- Use NestJS built-in exceptions (`NotFoundException`, `BadRequestException`, `ForbiddenException`, etc.) for standard cases.
- Create domain-specific exception classes extending `HttpException` when you need richer error responses (display messages, error codes, custom payloads).

## Environment Config

```typescript
// env.configs.ts
export const ENV_SCHEMA = Joi.object({
  STAGE: Joi.string().required(),
  PORT: Joi.number().default(3000),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(3306),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().optional().allow(''),
  DB_DATABASE: Joi.string().required(),
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
  // ...
})
```

- Validate ALL env vars with Joi at startup (fail fast).
- Use `ConfigModule.forRoot({ isGlobal: true, validationSchema: ENV_SCHEMA })`.
- Use `ConfigService.get()` in async factories (e.g., TypeORM config), a static `Config` object for values needed at import time.

## Database Migrations

```typescript
export class CreateOrdersTable1700000000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'orders',
      columns: [
        { name: 'id', type: 'bigint', unsigned: true, isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
        { name: 'name', type: 'varchar', length: '255', isNullable: false },
        { name: 'amount', type: 'decimal', precision: 12, scale: 2, unsigned: true },
        { name: 'user_id', type: 'bigint', unsigned: true, isNullable: false },
        { name: 'created_at', type: 'timestamp(3)', isNullable: false },
        { name: 'updated_at', type: 'timestamp(3)', isNullable: true },
      ],
      indices: [
        { name: 'idx_orders_user', columnNames: ['user_id'] },
      ],
    }))
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('orders')
  }
}
```

- **Never** use `synchronize: true`. Always use migrations.
- Use `timestamp(3)` for all date/time columns (millisecond precision).
- Build the project before running migrations (they execute from `dist/`).
- Consider creating helper functions for common column definitions if you find yourself repeating the same column shapes.

## Bootstrap (main.ts)

```typescript
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,         // Strip unknown properties
    transform: true,         // Auto-transform to DTO types
    transformOptions: { enableImplicitConversion: true },
  }))

  // Session, Passport, CORS setup...
  await app.listen(port)
}
```

Key bootstrap choices:
- `whitelist: true` on ValidationPipe (security: strip unexpected fields)
- Redis-backed sessions via `express-session` + `connect-redis`
- Global exception filter registered as `APP_FILTER`
- Global guards registered as `APP_GUARD`

## Key Rules

1. **Never use floating point for money.** Use `decimal.js` and store as `DECIMAL` in DB.
2. **Never use `synchronize: true`** in TypeORM. Always use migrations.
3. **Timestamps use MySQL `TIMESTAMP(3)`** for readability with millisecond precision. A transformer converts to/from epoch milliseconds in code.
4. **snake_case everywhere in entities.** Property names match DB column names directly. No automatic case conversion.
5. **Circular dependencies** are resolved with `forwardRef()` at both module and service level. If `forwardRef` isn't enough, flag it - don't silently restructure.
6. **Repositories stay private** to their module. Other modules access data through exported services.
7. **Controllers are thin.** They validate input (via DTOs) and delegate to services.
8. **DTOs define the API contract.** Input DTOs validate, output DTOs shape responses with static `build()` methods.
9. **Global validation pipe** with `whitelist: true` strips unknown fields from all requests.
10. **Fail fast on bad config.** Joi validates all env vars at startup.
