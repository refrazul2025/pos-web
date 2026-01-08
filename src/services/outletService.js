
const outletService = {
    async getOutlet(user) {
        await new Promise(resolve => setTimeout(resolve, 500))

        if (user && user.id) {
            return {
                id: 101,
                name: 'Tienda Principal',
                address: 'Calle Falsa 123'
            }
        }
        return null
    }
}

export default outletService
