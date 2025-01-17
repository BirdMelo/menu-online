import api from './api.js';

const ui = {
    toggleShoppingBag: function() {
        document.querySelector('#shopping_bag__footer__button').addEventListener('click', function() {
            var footer = document.querySelector('footer')
            footer.classList.toggle('expanded')
        })
    },
    rederizeProducts: async function() {
        const menu = await api.getMenu()
        const menuList = document.querySelector('#list')
        menuList.innerHTML = ''
        menu.forEach(product => {
            const li = document.createElement('li');
            const image = document.createElement('img');
            image.src = `../img/snack_pic/${product.img}`;
            image.alt = product.name;
            
            const dish_name = document.createElement('p');
            dish_name.id = 'dish_name';
            dish_name.textContent = product.name;

            const button_container = document.createElement('div');
            button_container.classList = 'button_product_container'

            const buy_button = document.createElement('button');
            buy_button.textContent = `adicionar por ${brlformat(product.price)}`;
            buy_button.addEventListener('click', function() {
                const shopping_bag = document.querySelector('#shopping_bag');
                const buying_item = document.createElement('li');

                const item_name = document.createElement('p');
                item_name.classList = "item_name";
                item_name.textContent = product.name;

                const item_price = document.createElement('p');
                item_price.classList = "item_price";
                item_price.textContent = brlformat(product.price);

                const slash_dotts = document.createElement('hr')
                slash_dotts.classList = "item_dots";

                buying_item.append(item_name, slash_dotts, item_price);
                shopping_bag.appendChild(buying_item);
            });

            const show_description = document.createElement('button');
            show_description.id = 'show_description';
            show_description.textContent = 'ver sobre';

            button_container.append(buy_button, show_description);

            li.append(image, dish_name, button_container );
            menuList.appendChild(li);
        })
    }
}
export default ui

function brlformat(price) {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}