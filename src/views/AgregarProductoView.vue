<template>
  <div class="agregar-producto-view container-fluid p-4 h-100 d-flex flex-column">
    <!-- Header -->
    <div class="d-flex align-items-center gap-3 mb-3">
      <img :src="logoSrc" alt="Icon" class="theme-logo" />
      <h1 class="m-0 fw-bold header-title">Productos</h1>
   </div>

    <!-- Lista de Productos -->
    <div class="flex-grow-1 overflow-auto mb-4 border rounded theme-table-container">
      <table class="table table-striped table-hover mb-0 sticky-header-table">
        <thead>
          <tr>
            <th class="p-2">Código</th>
            <th class="p-2">Descripción</th>
            <th class="p-2">Categoría 1</th>
            <th class="p-2">Precio Venta</th>
            <th class="p-2">Stock</th>
            <th class="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.codigo">
            <td class="p-2">{{ product.codigo }}</td>
            <td class="p-2">{{ product.descripcion }}</td>
            <td class="p-2">{{ product.categoria1 }}</td>
            <td class="p-2">{{ product.precioVenta }}</td>
            <td class="p-2">{{ product.stock }}</td>
            <td class="p-2">
               <button @click="editProd(product)" class="btn btn-sm btn-outline-primary me-2">Editar</button>
               <button @click="deleteProd(product.codigo)" class="btn btn-sm btn-outline-danger">Eliminar</button>
            </td>
          </tr>
          <tr v-if="products.length === 0">
             <td colspan="6" class="p-4 text-center text-muted">No hay productos agregados.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Formulario de Alta -->
    <div class="p-4 rounded border theme-form-container">
        <div class="row g-3 align-items-center">
            
            <div class="col-md-6 d-flex align-items-center">
                <label class="form-label me-2 mb-0 fw-medium text-nowrap" style="min-width: 100px; text-align: right;">Código:</label>
                <input v-model="form.codigo" type="text" class="form-control" placeholder="Código" :disabled="isEditing" />
            </div>

            <div class="col-md-6 d-flex align-items-center">
                <label class="form-label me-2 mb-0 fw-medium text-nowrap" style="min-width: 100px; text-align: right;">Descripción:</label>
                <input v-model="form.descripcion" type="text" class="form-control" placeholder="Descripción" />
            </div>

            <div class="col-md-6 d-flex align-items-center">
                <label class="form-label me-2 mb-0 fw-medium text-nowrap" style="min-width: 100px; text-align: right;">Categoría 1:</label>
                <input v-model="form.categoria1" type="text" class="form-control" placeholder="Categoría 1" />
            </div>
            
            <div class="col-md-6 d-flex align-items-center">
                <label class="form-label me-2 mb-0 fw-medium text-nowrap" style="min-width: 100px; text-align: right;">Categoría 2:</label>
                <input v-model="form.categoria2" type="text" class="form-control" placeholder="Categoría 2" />
            </div>

            <div class="col-md-6 d-flex align-items-center">
                <label class="form-label me-2 mb-0 fw-medium text-nowrap" style="min-width: 100px; text-align: right;">C. Barras:</label>
                <input v-model="form.codigoBarras" type="text" class="form-control" placeholder="Código de Barras" />
            </div>

             <div class="col-md-6 d-flex align-items-center">
                <label class="form-label me-2 mb-0 fw-medium text-nowrap" style="min-width: 100px; text-align: right;">Stock:</label>
                <input v-model.number="form.stock" type="number" class="form-control" placeholder="Stock" />
            </div>

            <div class="col-md-6 d-flex align-items-center">
                <label class="form-label me-2 mb-0 fw-medium text-nowrap" style="min-width: 100px; text-align: right;">P. Compra:</label>
                <input v-model.number="form.precioCompra" type="number" class="form-control" placeholder="Precio compra" />
            </div>

            <div class="col-md-6 d-flex align-items-center">
                <label class="form-label me-2 mb-0 fw-medium text-nowrap" style="min-width: 100px; text-align: right;">P. Venta:</label>
                <input v-model.number="form.precioVenta" type="number" class="form-control" placeholder="Precio venta" />
            </div>

            <div class="col-12 mt-4 d-flex gap-2">
                <button @click="guardar" class="btn btn-primary w-100 fw-bold py-2">
                    {{ isEditing ? 'Actualizar Producto' : 'Guardar Producto' }}
                </button>
                <button v-if="isEditing" @click="cancelEdit" class="btn btn-secondary w-100 fw-bold py-2">
                    Cancelar
                </button>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, ref } from 'vue';
import { useProductsStore } from '@/stores/products';
import { useThemeStore } from '@/stores/theme';

// Import theme logos
import logoHelloKitty from '@/assets/images/logo-theme-hello-kitty.png';
import logoAot from '@/assets/images/logo-theme-aot.png';
import logoDark from '@/assets/images/logo-theme-dark.png';

const productsStore = useProductsStore();
const themeStore = useThemeStore();

const products = computed(() => productsStore.products);

const logoSrc = computed(() => {
  switch (themeStore.currentTheme) {
    case 'theme-aot': return logoAot;
    case 'theme-dark': return logoDark;
    default: return logoHelloKitty;
  }
});

const isEditing = ref(false);

const form = reactive({
  codigo: '',
  descripcion: '',
  categoria1: '',
  categoria2: '',
  codigoBarras: '',
  precioCompra: null,
  precioVenta: null,
  stock: null
});

const guardar = () => {
  if (!form.codigo || !form.descripcion) {
    alert('Por favor complete al menos el código y la descripción.');
    return;
  }
  
  if (isEditing.value) {
      productsStore.updateProduct({ ...form });
      isEditing.value = false;
  } else {
      // Check for duplicate code
      if (products.value.some(p => p.codigo === form.codigo)) {
          alert('El código de producto ya existe.');
          return;
      }
      productsStore.addProduct({ ...form });
  }
  
  // Reset form
  resetForm();
};

const editProd = (product) => {
    Object.assign(form, product);
    isEditing.value = true;
};

const cancelEdit = () => {
    isEditing.value = false;
    resetForm();
};

const resetForm = () => {
  Object.keys(form).forEach(key => {
    form[key] = key.includes('precio') || key === 'stock' ? null : '';
  });
}

const deleteProd = (codigo) => {
    if(confirm('¿Estás seguro de eliminar este producto?')) {
        productsStore.deleteProduct(codigo);
        if (isEditing.value && form.codigo === codigo) {
            cancelEdit();
        }
    }
}
</script>

<style scoped>
/* Use CSS variables for theming */
.theme-logo {
    width: 40px; 
    height: 40px; 
    object-fit: contain;
}

.header-title {
    color: var(--bs-primary);
    font-size: 1.5rem;
}

.theme-table-container {
    background-color: var(--bs-card-bg);
    border-color: var(--bs-secondary) !important;
}

.theme-form-container {
    background-color: var(--bs-card-bg);
    border-color: var(--bs-secondary) !important;
}

.sticky-header-table thead th {
    position: sticky;
    top: 0;
    background-color: var(--bs-body-bg); /* Or secondary if desired */
    color: var(--bs-primary);
    border-bottom: 2px solid var(--bs-secondary);
    z-index: 10;
}

/* Ensure inputs blend well or stand out based on theme */
.form-control:focus {
    box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.25);
    border-color: var(--bs-primary);
}
</style>
