import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const MOCK_PRODUCTS = [
  { id: 1, name: 'Organic Tomatoes', price: 45.00, category: 'Vegetables', unit: 'kg', stock: 200, sku: 'VEG-001', icon: 'mdi-food-apple' },
  { id: 2, name: 'Fresh Lettuce', price: 30.00, category: 'Vegetables', unit: 'head', stock: 150, sku: 'VEG-002', icon: 'mdi-leaf' },
  { id: 3, name: 'Organic Carrots', price: 35.00, category: 'Vegetables', unit: 'kg', stock: 180, sku: 'VEG-003', icon: 'mdi-food-apple' },
  { id: 4, name: 'Sweet Corn', price: 25.00, category: 'Vegetables', unit: 'pc', stock: 300, sku: 'VEG-004', icon: 'mdi-corn' },
  { id: 5, name: 'Brown Rice', price: 55.00, category: 'Grains', unit: 'kg', stock: 500, sku: 'GRN-001', icon: 'mdi-grain' },
  { id: 6, name: 'White Onions', price: 40.00, category: 'Vegetables', unit: 'kg', stock: 220, sku: 'VEG-005', icon: 'mdi-food-apple' },
  { id: 7, name: 'Garlic', price: 80.00, category: 'Herbs', unit: 'kg', stock: 100, sku: 'HRB-001', icon: 'mdi-sprout' },
  { id: 8, name: 'Ginger', price: 90.00, category: 'Herbs', unit: 'kg', stock: 80, sku: 'HRB-002', icon: 'mdi-sprout' },
  { id: 9, name: 'Pechay', price: 20.00, category: 'Vegetables', unit: 'bundle', stock: 200, sku: 'VEG-006', icon: 'mdi-leaf' },
  { id: 10, name: 'Kangkong', price: 15.00, category: 'Vegetables', unit: 'bundle', stock: 250, sku: 'VEG-007', icon: 'mdi-leaf' },
  { id: 11, name: 'Ampalaya', price: 35.00, category: 'Vegetables', unit: 'pc', stock: 120, sku: 'VEG-008', icon: 'mdi-food-apple' },
  { id: 12, name: 'Sitaw', price: 25.00, category: 'Vegetables', unit: 'bundle', stock: 160, sku: 'VEG-009', icon: 'mdi-sprout' },
]

export const usePosStore = defineStore('pos', () => {
  const products = ref(MOCK_PRODUCTS)
  const cart = ref([])
  const transactions = ref(JSON.parse(localStorage.getItem('pos_transactions') || '[]'))
  const searchQuery = ref('')
  const selectedCategory = ref('All')
  const currentTransaction = ref(null)

  const categories = computed(() => {
    const cats = [...new Set(products.value.map(p => p.category))]
    return ['All', ...cats]
  })

  const filteredProducts = computed(() => {
    return products.value.filter(p => {
      const matchCat = selectedCategory.value === 'All' || p.category === selectedCategory.value
      const matchSearch = !searchQuery.value || p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.value.toLowerCase())
      return matchCat && matchSearch
    })
  })

  const cartTotal = computed(() => cart.value.reduce((sum, item) => sum + (item.price * item.qty), 0))
  const cartCount = computed(() => cart.value.reduce((sum, item) => sum + item.qty, 0))
  const cartItems = computed(() => cart.value)

  function addToCart(product) {
    const existing = cart.value.find(i => i.id === product.id)
    if (existing) {
      existing.qty++
    } else {
      cart.value.push({ ...product, qty: 1 })
    }
  }

  function removeFromCart(productId) {
    cart.value = cart.value.filter(i => i.id !== productId)
  }

  function updateQty(productId, qty) {
    const item = cart.value.find(i => i.id === productId)
    if (item) {
      if (qty <= 0) removeFromCart(productId)
      else item.qty = qty
    }
  }

  function clearCart() {
    cart.value = []
  }

  function processPayment(paymentMethod, amountTendered, cashier) {
    const txn = {
      id: `TXN-${Date.now()}`,
      date: new Date().toISOString(),
      items: [...cart.value],
      subtotal: cartTotal.value,
      tax: cartTotal.value * 0.12,
      total: cartTotal.value * 1.12,
      paymentMethod,
      amountTendered,
      change: amountTendered - (cartTotal.value * 1.12),
      cashier,
      status: 'completed'
    }
    transactions.value.unshift(txn)
    localStorage.setItem('pos_transactions', JSON.stringify(transactions.value.slice(0, 500)))
    currentTransaction.value = txn
    clearCart()
    return txn
  }

  function getTodaysTransactions() {
    const today = new Date().toDateString()
    return transactions.value.filter(t => new Date(t.date).toDateString() === today)
  }

  function getTodaysSales() {
    return getTodaysTransactions().reduce((sum, t) => sum + t.total, 0)
  }

  return {
    products, cart, transactions, searchQuery, selectedCategory, currentTransaction,
    categories, filteredProducts, cartTotal, cartCount, cartItems,
    addToCart, removeFromCart, updateQty, clearCart, processPayment,
    getTodaysTransactions, getTodaysSales
  }
})
