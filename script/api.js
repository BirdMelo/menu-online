const DATA_BASE = 'https://gist.githubusercontent.com/BirdMelo/90d566ec479b51109d53dcd88f6f6496/raw/922bd054fad7ac94cee18c8986e4af1c2f6ebe90/dbMenu'

const api = {
    async getMenu() {
        try {
            const menu = await axios.get(`${DATA_BASE}`)
            return menu.data.menu

        } catch (error) {
            alert("Erro ao buscar menu")
            console.error(error)
            throw error
        }
    }
}

export default api;