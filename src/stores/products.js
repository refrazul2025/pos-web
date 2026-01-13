import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useProductsStore = defineStore('products', () => {
    const products = ref([]);

    function addProduct(product) {
        products.value.push(product);
    }

    function deleteProduct(codigo) {
        const index = products.value.findIndex(p => p.codigo === codigo);
        if (index !== -1) {
            products.value.splice(index, 1);
        }
    }

    function updateProduct(updatedProduct) {
        const index = products.value.findIndex(p => p.codigo === updatedProduct.codigo);
        if (index !== -1) {
            products.value[index] = updatedProduct;
        }
    }

    return {
        products,
        addProduct,
        deleteProduct,
        updateProduct
    };
});
