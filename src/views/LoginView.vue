<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import authService from '@/services/authService'
import outletService from '@/services/outletService'
import asistenciaService from '@/services/asistenciaService'
import { useThemeStore } from '@/stores/theme'

// Import theme logos
import logoHelloKitty from '@/assets/images/logo-theme-hello-kitty.png'
import logoAot from '@/assets/images/logo-theme-aot.png'
import logoDark from '@/assets/images/logo-theme-dark.png'

const router = useRouter()
const themeStore = useThemeStore()

const logoSrc = computed(() => {
  switch (themeStore.currentTheme) {
    case 'theme-aot': return logoAot
    case 'theme-dark': return logoDark
    default: return logoHelloKitty
  }
})

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorVisible = ref(false)

const handleLogin = async () => {
  errorVisible.value = false
  loading.value = true

  try {
    const user = await authService.validate(email.value, password.value)

    if (!user) {
      errorVisible.value = true
      return
    }

    const outlet = await outletService.getOutlet(user)

    if (!outlet) {
      alert('No se encontró la tienda asociada al usuario')
      return
    }

    await asistenciaService.registrarAsistencia(user.id)

    // Guardar sesión (opcional)
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('outlet', JSON.stringify(outlet))

    // Redirigir a la vista principal
    router.push('/principal')

  } catch (error) {
    console.error(error)
    alert('Error al iniciar sesión')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="d-flex justify-content-center align-items-center min-vh-100">
    <div class="card shadow-lg p-4" style="width: 400px; background-color: var(--bs-card-bg); color: var(--bs-body-color);">
      <div class="card-body">
        <div class="text-center mb-4">
          <img
            :src="logoSrc"
            alt="Login"
            class="img-fluid"
            style="height: 150px; object-fit: contain;"
          />
        </div>

        <div v-if="errorVisible" class="alert alert-danger text-center" role="alert">
          Usuario / contraseña incorrectos
        </div>

        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label class="form-label">Correo</label>
            <input
              v-model="email"
              type="email"
              class="form-control"
              placeholder="email"
              required
            />
          </div>

          <div class="mb-3">
            <label class="form-label">Password</label>
            <input
              v-model="password"
              type="password"
              class="form-control"
              placeholder="password"
              required
            />
          </div>

          <button
            type="submit"
            class="btn btn-primary w-100 text-uppercase fw-bold"
            :disabled="loading"
          >
            {{ loading ? 'Cargando...' : 'Ingresar' }}
          </button>
        </form>

        <div v-if="loading" class="d-flex justify-content-center mt-3">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* No custom styles needed, relying on Bootstrap and global theme variables */
</style>