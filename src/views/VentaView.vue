<script setup>
import { ref, reactive, computed } from 'vue'

// --- State ---
const filters = reactive({
  codigo: '',
  descripcion: '',
  categoria: '',
  barras: ''
})

const showQuickAdd = ref(false)

const quickProduct = reactive({
  descripcion: '',
  categoria: '',
  precio: ''
})

const items = ref([
  { id: 1, codigo: 'P001', descripcion: 'Coca Cola 600ml', categoria: 'Bebidas', precio: 15.00, stock: 50 },
  { id: 2, codigo: 'P002', descripcion: 'Sabritas Sal', categoria: 'Botanas', precio: 12.00, stock: 30 },
  { id: 3, codigo: 'P003', descripcion: 'Galletas Marias', categoria: 'Galletas', precio: 10.50, stock: 20 },
  { id: 4, codigo: 'P004', descripcion: 'Agua Ciel 1L', categoria: 'Bebidas', precio: 10.00, stock: 40 },
  { id: 5, codigo: 'P005', descripcion: 'Chicles Trident', categoria: 'Dulces', precio: 5.00, stock: 100 },
])

const cart = ref([])

const saleDetails = reactive({
  tipoPago: 'Efectivo',
  tipoVenta: 'Contado',
  montoApartado: 0,
  cliente: ''
})

// --- Computed ---
const filteredItems = computed(() => {
  return items.value.filter(item => {
    const matchCode = item.codigo.toLowerCase().includes(filters.codigo.toLowerCase())
    const matchDesc = item.descripcion.toLowerCase().includes(filters.descripcion.toLowerCase())
    const matchCat = item.categoria.toLowerCase().includes(filters.categoria.toLowerCase())
    // Dummy logic for 'barras' as it's not in the item model yet -> assume 'codigo' is close enough
    const matchBarras = filters.barras ? item.codigo.includes(filters.barras) : true 
    
    return matchCode && matchDesc && matchCat && matchBarras
  })
})

const totalProducts = computed(() => {
  return cart.value.reduce((acc, item) => acc + item.quantity, 0)
})

const totalImporte = computed(() => {
  return cart.value.reduce((acc, item) => acc + (item.precio * item.quantity), 0).toFixed(2)
})

const isApartado = computed(() => saleDetails.tipoVenta === 'Apartado')

// --- Actions ---
const addToCart = (product) => {
  const existing = cart.value.find(p => p.id === product.id)
  if (existing) {
    existing.quantity++
  } else {
    cart.value.push({ ...product, quantity: 1 })
  }
}

const removeFromCart = (index) => {
  cart.value.splice(index, 1)
}

const toggleQuickAdd = () => {
  showQuickAdd.value = !showQuickAdd.value
}

const addQuickProduct = () => {
  if (!quickProduct.descripcion || !quickProduct.precio) return
  
  const newProd = {
    id: Date.now(),
    codigo: 'TEMP-' + Math.floor(Math.random() * 1000),
    descripcion: quickProduct.descripcion,
    categoria: quickProduct.categoria || 'General',
    precio: parseFloat(quickProduct.precio),
    stock: 999
  }
  
  // Add to cart directly? Or to items list? 
  // The JavaFX "Agregar" usually adds to the cart or the list. 
  // Let's assume it adds to the cart for a quick sale.
  addToCart(newProd)
  
  // Reset
  quickProduct.descripcion = ''
  quickProduct.categoria = ''
  quickProduct.precio = ''
  showQuickAdd.value = false
}

const generateSale = () => {
  alert(`Venta Generada!\nTotal: $${totalImporte.value}\nCliente: ${saleDetails.cliente || 'Publico General'}`)
  cart.value = []
  saleDetails.cliente = ''
  saleDetails.montoApartado = 0
}
</script>

<template>
  <div class="venta-container d-flex flex-column h-100 p-4 animate-fade-in">
    
    <!-- Filtros -->
    <div class="row g-3 mb-4 filter-bar p-3 rounded shadow-sm" style="background-color: var(--bs-card-bg);">
      <div class="col-md-3">
        <div class="form-floating">
          <input type="text" class="form-control" id="filtroCodigo" placeholder="Código" v-model="filters.codigo">
          <label for="filtroCodigo">Código</label>
        </div>
      </div>
      <div class="col-md-3">
        <div class="form-floating">
          <input type="text" class="form-control" id="filtroDescripcion" placeholder="Descripción" v-model="filters.descripcion">
          <label for="filtroDescripcion">Descripción</label>
        </div>
      </div>
      <div class="col-md-3">
        <div class="form-floating">
          <input type="text" class="form-control" id="filtroCategoria" placeholder="Categoría" v-model="filters.categoria">
          <label for="filtroCategoria">Categoría</label>
        </div>
      </div>
      <div class="col-md-3">
        <div class="form-floating">
          <input type="text" class="form-control" id="filtroBarras" placeholder="Código Barras" v-model="filters.barras">
          <label for="filtroBarras">Código Barras</label>
        </div>
      </div>
    </div>

    <!-- Product Table -->
    <div class="card shadow-sm border-0 mb-3 flex-grow-1 overflow-hidden main-table-card">
      <div class="card-header bg-transparent border-0 d-flex justify-content-between align-items-center py-3">
        <h5 class="mb-0 fw-bold text-primary">Catálogo de Productos</h5>
        <span class="badge bg-light text-secondary">{{ filteredItems.length }} resultados</span>
      </div>
      <div class="card-body p-0 table-responsive">
        <table class="table table-hover table-striped mb-0 align-middle">
          <thead class="sticky-top" style="background-color: var(--bs-body-bg); color: var(--bs-body-color);">
            <tr>
              <th>Código</th>
              <th>Descripción</th>
              <th>Categoría</th>
              <th class="text-end">Precio</th>
              <th class="text-end">Stock</th>
              <th class="text-center">Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredItems" :key="item.id" @dblclick="addToCart(item)" class="cursor-pointer">
              <td><span class="fw-medium">{{ item.codigo }}</span></td>
              <td>{{ item.descripcion }}</td>
              <td><span class="badge rounded-pill bg-info bg-opacity-10 text-info">{{ item.categoria }}</span></td>
              <td class="text-end fw-bold">${{ item.precio.toFixed(2) }}</td>
              <td class="text-end" :class="{'text-danger': item.stock < 10}">{{ item.stock }}</td>
              <td class="text-center">
                <button class="btn btn-sm btn-outline-primary rounded-circle" @click="addToCart(item)">
                  <i class="bi bi-plus"></i> +
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Quick Form Button -->
    <div class="mb-3">
      <button class="btn btn-primary d-flex align-items-center gap-2 shadow-sm" @click="toggleQuickAdd">
        <span>⚡ Agregar producto rápido</span>
      </button>
    </div>

    <!-- Quick Form -->
    <div v-if="showQuickAdd" class="card shadow-sm border-0 mb-4 animate-slide-down" style="background-color: var(--bs-card-bg);">
      <div class="card-body">
        <div class="row g-2 align-items-end">
          <div class="col-md-5">
            <label class="form-label small text-muted">Descripción</label>
            <input type="text" class="form-control" v-model="quickProduct.descripcion" placeholder="Producto temporal...">
          </div>
          <div class="col-md-3">
             <label class="form-label small text-muted">Texto Ticket</label>
            <input type="text" class="form-control" v-model="quickProduct.categoria" placeholder="Categoría...">
          </div>
          <div class="col-md-2">
             <label class="form-label small text-muted">Precio</label>
            <div class="input-group">
              <span class="input-group-text">$</span>
              <input type="number" class="form-control" v-model="quickProduct.precio" placeholder="0.00">
            </div>
          </div>
          <div class="col-md-2 d-flex gap-2">
            <button class="btn btn-success flex-grow-1 text-white fw-bold" @click="addQuickProduct">Agregar</button>
            <button class="btn btn-outline-danger" @click="toggleQuickAdd">X</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Selected Items (Cart) -->
    <div class="card shadow-lg border-0 flex-grow-1 overflow-hidden mb-4 cart-card">
       <div class="card-header bg-primary text-white py-3">
        <h5 class="mb-0"><i class="bi bi-cart3 me-2"></i>Productos Seleccionados</h5>
      </div>
      <div class="card-body p-0 table-responsive">
        <table class="table mb-0 align-middle">
          <thead class="sticky-top" style="background-color: var(--bs-body-bg); color: var(--bs-body-color);">
            <tr>
              <th>Descripción</th>
              <th class="text-center" width="120">Cantidad</th>
              <th class="text-end" width="120">Precio Unit.</th>
              <th class="text-end" width="120">Total</th>
              <th width="50"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in cart" :key="idx">
              <td class="fw-medium">{{ item.descripcion }}</td>
              <td class="text-center">
                <input type="number" class="form-control form-control-sm text-center d-inline-block w-75" v-model.number="item.quantity" min="1">
              </td>
              <td class="text-end text-muted">${{ item.precio.toFixed(2) }}</td>
              <td class="text-end fw-bold">${{ (item.precio * item.quantity).toFixed(2) }}</td>
              <td class="text-center">
                <button class="btn btn-sm text-danger hover-scale" @click="removeFromCart(idx)" title="Eliminar">
                  &times;
                </button>
              </td>
            </tr>
            <tr v-if="cart.length === 0">
              <td colspan="5" class="text-center py-5 text-muted">
                <div class="d-flex flex-column align-items-center">
                  <i class="bi bi-basket display-4 mb-2 opacity-50"></i>
                  <p>No hay productos seleccionados</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Footer / Checkout -->
    <div class="checkout-bar p-4 rounded shadow-lg border-top border-primary border-3">
      <!-- Totals Row -->
      <div class="d-flex justify-content-end gap-5 mb-4 border-bottom pb-3">
        <div class="text-end">
          <div class="text-muted small text-uppercase">Total Productos</div>
          <div class="fs-4 fw-bold">{{ totalProducts }}</div>
        </div>
        <div class="text-end">
          <div class="text-muted small text-uppercase">Total Importe</div>
          <div class="fs-2 fw-bolder text-primary">${{ totalImporte }}</div>
        </div>
      </div>

      <!-- Controls Row -->
      <div class="row g-3 align-items-end">
        <div class="col-md-2">
          <label class="form-label fw-bold">Tipo Pago</label>
          <select class="form-select" v-model="saleDetails.tipoPago">
            <option>Efectivo</option>
            <option>Transferencia</option>
            <option>Tarjeta</option>
          </select>
        </div>
        
        <div class="col-md-2">
          <label class="form-label fw-bold">Tipo Venta</label>
           <select class="form-select" v-model="saleDetails.tipoVenta">
            <option>Contado</option>
            <option>Apartado</option>
          </select>
        </div>

        <div class="col-md-2">
          <label class="form-label fw-bold">Monto A/C</label>
          <div class="input-group">
            <span class="input-group-text">$</span>
            <input type="number" class="form-control" v-model="saleDetails.montoApartado" :disabled="!isApartado" placeholder="0.00">
          </div>
        </div>

        <div class="col-md-4">
          <label class="form-label fw-bold">Cliente</label>
          <div class="input-group">
             <span class="input-group-text"><i class="bi bi-person"></i></span>
            <input type="text" class="form-control" v-model="saleDetails.cliente" placeholder="Nombre del cliente...">
          </div>
        </div>

        <div class="col-md-2">
          <button class="btn btn-success w-100 py-2 fw-bold text-uppercase shadow hover-lift" @click="generateSale" :disabled="cart.length === 0">
            <i class="bi bi-check-lg me-1"></i> Generar
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.venta-container {
  background-color: var(--bs-body-bg);
  max-width: 1400px;
  margin: 0 auto;
}

.filter-bar {
  border-left: 4px solid var(--bs-primary);
}

.main-table-card {
  min-height: 250px;
}

.cursor-pointer {
  cursor: pointer;
}

/* Glassmorphism touches */
.checkout-bar {
  background-color: var(--bs-card-bg);
  backdrop-filter: blur(10px);
  border-top-color: var(--bs-border-color) !important;
}

/* Animations */
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

.animate-slide-down {
  animation: slideDown 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.hover-scale:hover {
  transform: scale(1.2);
  transition: transform 0.2s;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
  transition: all 0.2s;
}

/* Custom Scrollbar for tables */
.table-responsive::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.table-responsive::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.table-responsive::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}
.table-responsive::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
