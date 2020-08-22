import Product from "./Product";
import CartItem from "./CartItem";
import CartRenderer from "../cart/CartRenderer";
import Category from "./Category";

export default class Cart {
    constructor({cartItems = []} = {}) {
        this.cartItems = cartItems;

        this.cartItemsProxy = new Proxy(this.cartItems, {
            set(val) {
                console.log('set', val);
            },
            apply(val) {
                console.log('apply', val);
            }
        });


        // Array.observe(this.cartItems, this.cartObserver);
        this.renderer = new CartRenderer(this);
        this.renderer.updateHeaderCart();
    }

    get totalPrice() {
        let totalPrice = 0;

        this.cartItems.forEach(cartItem => {
            totalPrice += cartItem.product.price * cartItem.quantity;
        });

        return totalPrice;
    }

    addProduct(product, quantity) {
        let cartItem = this.findCartItemByProduct(product);

        if (cartItem) {
            cartItem.increaseQuantity(quantity);
        } else {
            cartItem = CartItem.create({ product, quantity });

            if (cartItem) this.cartItems.push(cartItem);
        }

        this.renderer.updateHeaderCart();
    }

    decreaseQuantity(product, quantity) {
        /**
         * @var CartItem
         */
        let cartItem = this.findCartItemByProduct(product);

        if (!cartItem) return;

        cartItem.decreaseQuantity(quantity);
    }

    removeProduct(product) {
        let cartItem = this.findCartItemByProduct(product);
        if (!cartItem) return;

        cartItem.reset();

        this.cartItems.splice(this.findCartItemIndexByProduct(product), 1);
    }

    findCartItemByProduct(product) {
        return this.cartItems.find(cartItem => console.log(cartItem));
    }

    findCartItemIndexByProduct(product) {
        let cartItemIndex = this.cartItems.findIndex(cartItem => cartItem.product.id === product.id);
        return cartItemIndex > -1 ? cartItemIndex : 0;
    }

    clear() {
        this.cartItems.forEach(cartItem => {
            if (cartItem) cartItem.reset();
        });

        this.cartItems = [];
    }

    static fromJson(jsonString) {
        let cartDecoded = typeof jsonString === 'object' ? jsonString : JSON.parse(jsonString),
            cartItems = [];


        if (!this.validate(cartDecoded)) { return null; }


        if (cartDecoded && 'cartItems' in cartDecoded) {
            cartDecoded.cartItems.forEach(cartItem => {
                cartItems.push(CartItem.fromJson(cartItem));
            });

            console.log('cartitems', cartItems);
        }

        return new this({cartItems});
    }

    static validate(obj) {
        if (obj === null) return false;

        let requiredProperties = [];

        if (requiredProperties.every(prop => prop in obj) === false) {
            console.error('Validation error, no such required props in given object');
            return false;
        }

        return true;
    }

    toJSON() {
        return {
            cartItems: this.cartItems,
        };
    }
}