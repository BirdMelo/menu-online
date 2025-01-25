import api from './api.js';
import bag from './shopping_bag__storage.js';

let total_price = 0;

const ui = {
    navbar_buttons() {
        let typefilte = 'Destaques';

        const search_input = document.getElementById('search_snack');
        const highlights_button = document.getElementById('highlights');
        const pizzas_button = document.getElementById('pizzas');
        const beverages_button = document.getElementById('beverages');
        const all_button = document.getElementById('all');

        highlights_button.classList.add('active');
        rederizeProducts('destaque');

        search_input.addEventListener('input', ()=> {
            typefilte = navbar_buttons_actions('pesquisado');
            rederizeProducts(typefilte, search_input.value);
        });

        highlights_button.addEventListener('click', ()=> {
            typefilte = navbar_buttons_actions('destaque');
            rederizeProducts(typefilte);
        });

        pizzas_button.addEventListener('click', ()=> {
            typefilte = navbar_buttons_actions('pizza');
            rederizeProducts(typefilte);
        });

        beverages_button.addEventListener('click', ()=> {
            typefilte = navbar_buttons_actions('bebida');
            rederizeProducts(typefilte);
        });

        all_button.addEventListener('click', ()=> {
            typefilte = navbar_buttons_actions('todo');
            rederizeProducts();
        });
    },
    bag_tab() {
        const storage = bag.get_bag();
        total_price = 0;
        storage.forEach(item => {
            add_item_bag(item);
            totalCost(item);
        })
        toggleShoppingBag('shopping_bag__footer__button', 'shopping_bag_footer');
        toggleShoppingBag('shopping_bag__aside__button', 'shopping_bag__aside');
    }
}
export default ui;

function brlformat(price) {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
function add_item_bag(item) {
    const shopping_tabs = document.querySelectorAll('.shopping_bag');
    shopping_tabs.forEach(shopping_tab => {
        const buying_item = document.createElement('li');
        
        const item_name = document.createElement('p');
        item_name.classList = "item_name";
        item_name.textContent = item.name;
        
        const item_price = document.createElement('p');
        item_price.classList = "item_price";
        item_price.textContent = brlformat(item.price);
        
        const slash_dotts = document.createElement('hr');
        slash_dotts.classList = "item_dots";
        
        buying_item.append(item_name, slash_dotts, item_price);
        shopping_tab.appendChild(buying_item);
    })
}
function toggleShoppingBag( button_id, container_id) {
    document.getElementById(button_id).addEventListener('click', function() {
        var container = document.getElementById(container_id);
        container.classList.toggle('expanded');
    })
}
function totalCost(item) {
    total_price += item.price;
    const totalCost = document.querySelector('.total_price');
    totalCost.textContent = `Total: ${brlformat(total_price)}`;
}
function navbar_buttons_actions(type) {
    const list_title = document.querySelector('.products h2');
    list_title.textContent = `${type.charAt(0).toUpperCase()}${type.slice(1)}s`;
    return type;
}
async function rederizeProducts(typefilte, text) {
    const menu = await api.getMenu();
    let menuFiltered = menu;
    if (typefilte) {
        menuFiltered = menu.filter(product => product.type.includes(typefilte));
    }
    if (typefilte === 'pesquisado') {
        menuFiltered = menu.filter(product => product.name.toLowerCase().includes(text.toLowerCase()));
    }
    const menuList = document.querySelector('#list');
    menuList.innerHTML = '';
    menuFiltered.forEach(product => {
        const li = document.createElement('li');
        const image = document.createElement('img');
        image.src = `../img/snack_pic/${product.img}`;
        image.alt = product.name;
        
        const dish_name = document.createElement('p');
        dish_name.id = 'dish_name';
        dish_name.textContent = product.name;

        const button_container = document.createElement('div');
        button_container.classList = 'button_product_container';

        const buy_button = document.createElement('button');
        buy_button.textContent = `adicionar por ${brlformat(product.price)}`;
        buy_button.addEventListener('click', function() {

            bag.addIn_bag(product);
            add_item_bag(product);
            totalCost(product);

        });

        const show_description = document.createElement('button');
        show_description.id = 'show_description';
        show_description.textContent = 'ver sobre';

        button_container.append(buy_button, show_description);

        li.append(image, dish_name, button_container );
        menuList.appendChild(li);
    })
}