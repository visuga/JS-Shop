import '../styles/index.scss';

import Mustache from 'mustache';

import Product from "./models/Product";
import StoreService from './storeService';

let storeService = new StoreService();
window.storeService = storeService;

storeService.loadData();

let cart = storeService.get('cart');
let products = storeService.get('products');

let recommendationArray = [];

recommendationArray.push(new Product({
    id: 1,
    title: 'Rollo LoyalBlue',
    price: '$92.00',
    img: '../src/img/item1.jpg',
    quantity: '100',
}));
recommendationArray.push(new Product({
    id: 2,
    title: 'Echasse Bowl',
    price: '$252.00',
    img: '../src/img/item2.jpg',
    quantity: '100',
}));
recommendationArray.push(new Product({
    id: 3,
    title: 'Mimic Mirror',
    price: '$44.00',
    img: '../src/img/item3.jpg',
    quantity: '100',
}));
recommendationArray.push(new Product({
    id: 4,
    title: 'rp78 turntable',
    price: '$190.05',
    img: '../src/img/item4.jpg',
    quantity: '100',
}));

let recommendationTMPL = document.getElementById('recommendation-tpl').innerHTML;

recommendationArray.forEach(recommendation => {
    let recommendationHTML = Mustache.render(recommendationTMPL, recommendation);
    document.querySelector('.recommendation-list').innerHTML += recommendationHTML;
});



window.onbeforeunload = function () {
    storeService.save();
    return true;
};

window.onload = function () {
    document.querySelector('body').classList.remove('loading')
};

Array.from(document.getElementsByClassName('recommendation-item-button')).forEach(element => {
    element.addEventListener('click', e => {
        console.log(e.target);
        let productEl = e.target.classList.contains('recommendation-item') ? e.target : e.target.closest('.recommendation-item');
 
        if (!productEl) return;
 
        let product = products.find(prd => prd.id == productEl.dataset.id);
 
        cart.addProduct(product, 1);
    });
 });


