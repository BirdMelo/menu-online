const storage = JSON.parse(localStorage.getItem('bag')) || []
const bag = {
    get_bag() {
        return storage
    },
    addIn_bag(item) {
        if(!item){
            console.error('item invalido')
            return
        }
        storage.push(item)
        localStorage.setItem('bag', JSON.stringify(storage))
    },
    delete_item(item) {
        storage
    }
}
export default bag