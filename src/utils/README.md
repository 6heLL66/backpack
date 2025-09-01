# Date Utils

Утилиты для форматирования дат с учетом таймзоны.

## Функции

### `formatDate(dateString, options?)`
Основная функция для форматирования дат. По умолчанию показывает дату и время с таймзоной.

**Параметры:**
- `dateString` - строка с датой
- `options` - опциональные настройки форматирования (Intl.DateTimeFormatOptions)

**Пример:**
```typescript
import { formatDate } from '../utils';

formatDate('2024-01-15T10:30:00Z');
// Результат: "Jan 15, 2024, 10:30 AM EST"
```

### `formatDateShort(dateString)`
Краткий формат даты (месяц, день, час, минуты).

**Пример:**
```typescript
import { formatDateShort } from '../utils';

formatDateShort('2024-01-15T10:30:00Z');
// Результат: "Jan 15, 10:30 AM"
```

### `formatDateLong(dateString)`
Полный формат даты с днем недели и секундами.

**Пример:**
```typescript
import { formatDateLong } from '../utils';

formatDateLong('2024-01-15T10:30:00Z');
// Результат: "Monday, January 15, 2024, 10:30:45 AM EST"
```

### `formatDateOnly(dateString)`
Только дата без времени.

**Пример:**
```typescript
import { formatDateOnly } from '../utils';

formatDateOnly('2024-01-15T10:30:00Z');
// Результат: "Jan 15, 2024"
```

### `formatTimeOnly(dateString)`
Только время без даты.

**Пример:**
```typescript
import { formatTimeOnly } from '../utils';

formatTimeOnly('2024-01-15T10:30:00Z');
// Результат: "10:30:45 AM"
```

## Особенности

- Все функции автоматически учитывают таймзону пользователя
- Используется локаль 'en-US' для единообразного отображения
- Поддерживает кастомные опции форматирования через Intl.DateTimeFormatOptions
- Автоматически обрабатывает различные форматы входных дат
