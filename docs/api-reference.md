# API Reference — TestPOS 2.0 Pinia Stores

## `useAuthStore` (`src/stores/auth.js`)

Manages user authentication state.

### State

| Property | Type | Description |
|----------|------|-------------|
| `user` | `Ref<Object\|null>` | Currently logged-in user object (without password) |

### Computed

| Property | Type | Description |
|----------|------|-------------|
| `isAuthenticated` | `ComputedRef<boolean>` | `true` if a user is logged in |
| `userRole` | `ComputedRef<string\|null>` | Role of the current user (`'admin'`, `'accounting'`, `'cashier'`) |
| `userName` | `ComputedRef<string>` | Display name of the current user |
| `userAvatar` | `ComputedRef<string>` | Single-character avatar initial |
| `isAdmin` | `ComputedRef<boolean>` | `true` if current user is admin |
| `isAccounting` | `ComputedRef<boolean>` | `true` if current user is accounting |
| `isCashier` | `ComputedRef<boolean>` | `true` if current user is cashier |
| `canAccessReports` | `ComputedRef<boolean>` | `true` if user role is `admin` or `accounting` |

### Actions

#### `login(username, password)`
Authenticates a user with the mock user list.
- **Parameters**: `username: string`, `password: string`
- **Returns**: `Object` — The authenticated user (without password field)
- **Throws**: `Error('Invalid credentials')` if no matching user is found
- **Side effects**: Sets `user` ref, persists to `localStorage`

#### `logout()`
Logs out the current user.
- **Side effects**: Clears `user` ref, removes `pos_user` from `localStorage`

---

## `useThemeStore` (`src/stores/theme.js`)

Manages the active UI theme.

### State

| Property | Type | Description |
|----------|------|-------------|
| `currentTheme` | `Ref<string>` | Active theme name: `'dawn'`, `'dusk'`, or `'amoled'` |
| `THEMES` | `string[]` | Ordered list of available theme names |

### Actions

#### `setTheme(theme)`
Sets the active theme.
- **Parameters**: `theme: string` — Must be one of `'dawn'`, `'dusk'`, `'amoled'`
- **Side effects**: Updates `currentTheme`, persists to `localStorage`

#### `cycleTheme()`
Advances to the next theme in the cycle: Dawn → Dusk → AMOLED → Dawn.
- **Side effects**: Calls `setTheme()` with the next theme

---

## `usePosStore` (`src/stores/pos.js`)

Manages POS products, shopping cart, and transactions.

### State

| Property | Type | Description |
|----------|------|-------------|
| `products` | `Ref<Product[]>` | Full product catalog |
| `cart` | `Ref<CartItem[]>` | Current cart items |
| `transactions` | `Ref<Transaction[]>` | All transactions (most recent first) |
| `searchQuery` | `Ref<string>` | Current product search query |
| `selectedCategory` | `Ref<string>` | Active category filter (`'All'` or category name) |
| `currentTransaction` | `Ref<Transaction\|null>` | Most recently completed transaction |

### Computed

| Property | Type | Description |
|----------|------|-------------|
| `categories` | `ComputedRef<string[]>` | `['All', ...unique categories]` |
| `filteredProducts` | `ComputedRef<Product[]>` | Products matching search and category filters |
| `cartTotal` | `ComputedRef<number>` | Sum of `price * qty` for all cart items (pre-tax) |
| `cartCount` | `ComputedRef<number>` | Total number of items (sum of quantities) in cart |
| `cartItems` | `ComputedRef<CartItem[]>` | Alias for `cart` |

### Actions

#### `addToCart(product)`
Adds a product to the cart or increments its quantity if already present.
- **Parameters**: `product: Product`

#### `removeFromCart(productId)`
Removes a product from the cart entirely.
- **Parameters**: `productId: number`

#### `updateQty(productId, qty)`
Sets the quantity of a cart item. If `qty <= 0`, the item is removed.
- **Parameters**: `productId: number`, `qty: number`

#### `clearCart()`
Empties the cart.

#### `processPayment(paymentMethod, amountTendered, cashier)`
Completes a transaction and saves it.
- **Parameters**:
  - `paymentMethod: string` — `'cash'`, `'card'`, or `'gcash'`
  - `amountTendered: number` — Amount given by the customer
  - `cashier: string` — Name of the cashier processing the payment
- **Returns**: `Transaction` object
- **Side effects**: Clears cart, stores transaction in `transactions`, persists to `localStorage`

#### `getTodaysTransactions()`
Returns all transactions from today.
- **Returns**: `Transaction[]`

#### `getTodaysSales()`
Returns the total sales revenue for today.
- **Returns**: `number`

### Type Definitions

```ts
interface Product {
  id: number
  name: string
  price: number
  category: string
  unit: string
  stock: number
  sku: string
  icon: string
}

interface CartItem extends Product {
  qty: number
}

interface Transaction {
  id: string          // Format: "TXN-{timestamp}"
  date: string        // ISO 8601 date string
  items: CartItem[]
  subtotal: number
  tax: number         // subtotal * 0.12
  total: number       // subtotal * 1.12
  paymentMethod: string
  amountTendered: number
  change: number
  cashier: string
  status: 'completed'
}
```

---

## `useReportsStore` (`src/stores/reports.js`)

Provides analytics and reporting functions over POS transaction data.

### State

| Property | Type | Description |
|----------|------|-------------|
| `dateRange` | `Ref<{start: string\|null, end: string\|null}>` | Active date range for reports |
| `reportType` | `Ref<string>` | Current report type (default: `'sales'`) |

### Computed

| Property | Type | Description |
|----------|------|-------------|
| `allTransactions` | `ComputedRef<Transaction[]>` | All transactions from the POS store |

### Actions

#### `getTransactionsByRange(start, end)`
Filters transactions by date range.
- **Parameters**:
  - `start: string\|null` — Start date (ISO format). Defaults to epoch if null.
  - `end: string\|null` — End date (ISO format). Defaults to now if null. End of day (23:59:59) is used.
- **Returns**: `Transaction[]`

#### `getSalesByDay(transactions)`
Groups transactions by day and sums their totals.
- **Parameters**: `transactions: Transaction[]`
- **Returns**: `Record<string, number>` — Map of `localeDateString → total sales`

#### `getTopProducts(transactions)`
Aggregates product sales across transactions and returns the top 10 by revenue.
- **Parameters**: `transactions: Transaction[]`
- **Returns**: `Array<{name: string, qty: number, revenue: number}>` sorted by revenue descending
