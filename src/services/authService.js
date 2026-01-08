
const authService = {
    async validate(email, password) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800))

        if (email === 'test' && password === 'test') {
            return {
                id: 1,
                name: 'Usuario Test',
                email: email,
                token: 'dummy-token-123'
            }
        }
        return null
    }
}

export default authService
