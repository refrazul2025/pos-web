
const asistenciaService = {
    async registrarAsistencia(userId) {
        await new Promise(resolve => setTimeout(resolve, 400))
        console.log(`Asistencia registrada para el usuario ${userId}`)
        return true
    }
}

export default asistenciaService
