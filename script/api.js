import axios from 'axios'
const DATA_BASE = 'http://localhost:3001/'

const api = {
    async getMenu() {
        try {
            const menu = await axios.get(`${DATA_BASE}menu`)
            return menu.data

        } catch (error) {
            alert("Erro ao buscar menu")
            console.error(error)
            throw error
        }
    }
}

export default api;