<template>
  <div>
    <div class="text-h5 font-weight-bold mb-4">POS Terminal</div>

    <v-row>
      <!-- Products Panel -->
      <v-col cols="12" md="7" lg="8">
        <v-card rounded="xl" elevation="1" height="100%">
          <v-card-text class="pa-3">
            <!-- Search and filter -->
            <v-row dense class="mb-2">
              <v-col cols="12" sm="7">
                <v-text-field
                  v-model="posStore.searchQuery"
                  placeholder="Search products or SKU..."
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  clearable
                  hide-details
                />
              </v-col>
              <v-col cols="12" sm="5">
                <v-select
                  v-model="posStore.selectedCategory"
                  :items="posStore.categories"
                  variant="outlined"
                  density="compact"
                  hide-details
                  prepend-inner-icon="mdi-tag"
                />
              </v-col>
            </v-row>

            <!-- Category chips -->
            <div class="d-flex flex-wrap ga-1 mb-3">
              <v-chip
                v-for="cat in posStore.categories"
                :key="cat"
                :color="posStore.selectedCategory === cat ? 'primary' : 'default'"
                :variant="posStore.selectedCategory === cat ? 'elevated' : 'tonal'"
                size="small"
                @click="posStore.selectedCategory = cat"
                style="cursor:pointer"
              >{{ cat }}</v-chip>
            </div>

            <!-- Product Grid -->
            <v-row dense>
              <v-col
                v-for="product in posStore.filteredProducts"
                :key="product.id"
                cols="6" sm="4" lg="3"
              >
                <v-card
                  rounded="lg"
                  elevation="0"
                  variant="outlined"
                  class="product-card pa-2 text-center"
                  @click="posStore.addToCart(product)"
                  style="cursor:pointer"
                  :ripple="true"
                >
                  <v-icon size="36" color="primary" class="mb-1">{{ product.icon }}</v-icon>
                  <div class="text-caption font-weight-bold text-truncate">{{ product.name }}</div>
                  <div class="text-caption text-medium-emphasis">{{ product.sku }}</div>
                  <v-chip color="success" size="x-small" variant="tonal" class="mt-1">
                    &#8369;{{ product.price.toFixed(2) }}/{{ product.unit }}
                  </v-chip>
                </v-card>
              </v-col>
              <v-col v-if="!posStore.filteredProducts.length" cols="12">
                <v-empty-state icon="mdi-package-variant-remove" title="No products found" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Cart Panel -->
      <v-col cols="12" md="5" lg="4">
        <v-card rounded="xl" elevation="1">
          <v-card-title class="d-flex align-center justify-space-between pa-4 pb-2">
            <span class="text-subtitle-1 font-weight-bold">
              <v-icon start color="primary">mdi-cart</v-icon>
              Cart
            </span>
            <v-badge :content="posStore.cartCount" color="primary" v-if="posStore.cartCount">
              <v-btn icon="mdi-delete-sweep" variant="text" color="error" size="small" @click="posStore.clearCart()" />
            </v-badge>
          </v-card-title>

          <v-divider />

          <v-card-text class="pa-0" style="max-height: 340px; overflow-y: auto;">
            <v-list v-if="posStore.cartItems.length" density="compact">
              <v-list-item
                v-for="item in posStore.cartItems"
                :key="item.id"
                class="py-2"
              >
                <template #title>
                  <div class="text-body-2 font-weight-medium">{{ item.name }}</div>
                  <div class="text-caption text-medium-emphasis">&#8369;{{ item.price.toFixed(2) }} &times; {{ item.qty }}</div>
                </template>
                <template #append>
                  <div class="d-flex align-center ga-1">
                    <v-btn icon="mdi-minus" size="x-small" variant="tonal" @click="posStore.updateQty(item.id, item.qty - 1)" />
                    <span class="text-body-2 font-weight-bold" style="min-width:24px;text-align:center">{{ item.qty }}</span>
                    <v-btn icon="mdi-plus" size="x-small" variant="tonal" color="primary" @click="posStore.updateQty(item.id, item.qty + 1)" />
                    <v-btn icon="mdi-trash-can" size="x-small" variant="text" color="error" @click="posStore.removeFromCart(item.id)" />
                  </div>
                </template>
              </v-list-item>
            </v-list>
            <div v-else class="text-center pa-6 text-medium-emphasis">
              <v-icon size="40" color="grey">mdi-cart-outline</v-icon>
              <div class="mt-2 text-body-2">Cart is empty</div>
              <div class="text-caption">Click products to add them</div>
            </div>
          </v-card-text>

          <v-divider />

          <v-card-text class="pa-4">
            <div class="d-flex justify-space-between text-body-2 mb-1">
              <span>Subtotal</span>
              <span>&#8369;{{ posStore.cartTotal.toFixed(2) }}</span>
            </div>
            <div class="d-flex justify-space-between text-body-2 mb-1 text-medium-emphasis">
              <span>VAT (12%)</span>
              <span>&#8369;{{ (posStore.cartTotal * 0.12).toFixed(2) }}</span>
            </div>
            <v-divider class="my-2" />
            <div class="d-flex justify-space-between text-h6 font-weight-bold text-primary">
              <span>TOTAL</span>
              <span>&#8369;{{ (posStore.cartTotal * 1.12).toFixed(2) }}</span>
            </div>
          </v-card-text>

          <v-card-actions class="pa-4 pt-0">
            <v-btn
              color="primary"
              size="large"
              block
              rounded="lg"
              :disabled="!posStore.cartItems.length"
              @click="showPaymentDialog = true"
            >
              <v-icon start>mdi-cash-register</v-icon>
              Process Payment
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Payment Dialog -->
    <v-dialog v-model="showPaymentDialog" max-width="480" persistent>
      <v-card rounded="xl">
        <v-card-title class="pa-4">
          <v-icon start color="primary">mdi-cash-register</v-icon>
          Process Payment
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-4">
          <div class="text-h5 text-center font-weight-bold text-primary mb-4">
            &#8369;{{ (posStore.cartTotal * 1.12).toFixed(2) }}
          </div>

          <div class="text-subtitle-2 mb-2">Payment Method</div>
          <div class="d-flex ga-2 mb-4">
            <v-btn
              v-for="method in paymentMethods"
              :key="method.value"
              :color="paymentMethod === method.value ? 'primary' : 'default'"
              :variant="paymentMethod === method.value ? 'elevated' : 'tonal'"
              :prepend-icon="method.icon"
              @click="paymentMethod = method.value"
              rounded="lg"
            >{{ method.label }}</v-btn>
          </div>

          <v-text-field
            v-if="paymentMethod === 'cash'"
            v-model.number="amountTendered"
            label="Amount Tendered"
            prepend-inner-icon="mdi-cash"
            variant="outlined"
            type="number"
            :min="posStore.cartTotal * 1.12"
          />

          <v-alert
            v-if="paymentMethod === 'cash' && change >= 0"
            type="success"
            variant="tonal"
            density="compact"
          >
            Change: <strong>&#8369;{{ change.toFixed(2) }}</strong>
          </v-alert>
          <v-alert
            v-if="paymentMethod === 'cash' && change < 0 && amountTendered > 0"
            type="error"
            variant="tonal"
            density="compact"
          >
            Insufficient amount. Need &#8369;{{ Math.abs(change).toFixed(2) }} more.
          </v-alert>
        </v-card-text>

        <v-card-actions class="pa-4 pt-0">
          <v-btn variant="text" @click="showPaymentDialog = false">Cancel</v-btn>
          <v-spacer />
          <v-btn
            color="primary"
            variant="elevated"
            :disabled="!canConfirm"
            @click="confirmPayment"
            rounded="lg"
          >
            <v-icon start>mdi-check-circle</v-icon>
            Confirm Payment
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Receipt Dialog -->
    <v-dialog v-model="showReceiptDialog" max-width="360">
      <v-card rounded="xl" v-if="posStore.currentTransaction">
        <v-card-title class="text-center pa-4">
          <v-icon color="success" size="48">mdi-check-circle</v-icon>
          <div class="text-h6 mt-2">Payment Successful!</div>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-4">
          <div class="text-caption text-center mb-3 text-medium-emphasis">{{ posStore.currentTransaction.id }}</div>
          <v-list density="compact">
            <v-list-item
              v-for="item in posStore.currentTransaction.items"
              :key="item.id"
              :title="item.name"
              :subtitle="`${item.qty} \xD7 \u20B1${item.price.toFixed(2)}`"
            >
              <template #append>&#8369;{{ (item.qty * item.price).toFixed(2) }}</template>
            </v-list-item>
          </v-list>
          <v-divider class="my-2" />
          <div class="d-flex justify-space-between text-body-2">
            <span>Subtotal</span><span>&#8369;{{ posStore.currentTransaction.subtotal.toFixed(2) }}</span>
          </div>
          <div class="d-flex justify-space-between text-body-2 text-medium-emphasis">
            <span>VAT 12%</span><span>&#8369;{{ posStore.currentTransaction.tax.toFixed(2) }}</span>
          </div>
          <div class="d-flex justify-space-between text-h6 font-weight-bold text-primary mt-1">
            <span>TOTAL</span><span>&#8369;{{ posStore.currentTransaction.total.toFixed(2) }}</span>
          </div>
          <div v-if="posStore.currentTransaction.paymentMethod === 'cash'" class="d-flex justify-space-between text-body-2 mt-2">
            <span>Change</span><span>&#8369;{{ posStore.currentTransaction.change.toFixed(2) }}</span>
          </div>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-btn color="primary" block @click="showReceiptDialog = false" rounded="lg">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePosStore } from '@/stores/pos'
import { useAuthStore } from '@/stores/auth'

const posStore = usePosStore()
const authStore = useAuthStore()

const showPaymentDialog = ref(false)
const showReceiptDialog = ref(false)
const paymentMethod = ref('cash')
const amountTendered = ref(0)

const paymentMethods = [
  { label: 'Cash', value: 'cash', icon: 'mdi-cash' },
  { label: 'Card', value: 'card', icon: 'mdi-credit-card' },
  { label: 'GCash', value: 'gcash', icon: 'mdi-cellphone' },
]

const totalDue = computed(() => posStore.cartTotal * 1.12)
const change = computed(() => amountTendered.value - totalDue.value)
const canConfirm = computed(() => {
  if (paymentMethod.value === 'cash') return amountTendered.value >= totalDue.value
  return true
})

function confirmPayment() {
  posStore.processPayment(paymentMethod.value, amountTendered.value, authStore.userName)
  showPaymentDialog.value = false
  showReceiptDialog.value = true
  paymentMethod.value = 'cash'
  amountTendered.value = 0
}
</script>

<style scoped>
.product-card {
  transition: transform 0.1s, box-shadow 0.1s;
}
.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
}
</style>
