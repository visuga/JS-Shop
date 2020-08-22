import Product from "./Product";
import Cart from "./Cart";

export default class CartItem {
    constructor({
        product = new Product(),
        quantity = 1
                } = {}) {
        this.product = product;
        this.quantity = quantity;
    }

    decreaseQuantity(quantity) {
        if (this.quantity < quantity) {
            quantity = this.quantity;
        }

        this.product.quantity += quantity;
        this.quantity -= quantity;
    }

    increaseQuantity(quantity) {
        if (this.product.quantity === 0) {
            console.error('Not enough products');
            return;
        }

        if (this.product.quantity < quantity) {
            quantity = this.product.quantity;
        }

        this.product.quantity -= quantity;
        this.quantity += quantity;
    }

    toJSON() {
        return {
            product: this.product,
            quantity: this.quantity,
        }
    }

    reset() {
        this.product.quantity += this.quantity;
        this.quantity = 0;
    }

    static create({product = new Product(), quantity = 1} = {}) {
        if (product.quantity === 0) {
            console.error(`Can't add product to cart, not enough quantity`);
            return null;
        }

        if (product.quantity < quantity) {
            quantity = product.quantity;
        }

        product.quantity -= quantity;

        return new this({
            product,
            quantity,
        });
    }

    static fromJson(jsonString) {
        let cartItemDecoded = typeof jsonString === 'object' ? jsonString : JSON.parse(jsonString);

        if (!this.validate(cartItemDecoded)) { return null; }

        cartItemDecoded['product'] = window.storeService.get('products').find(product => product.id == cartItemDecoded['product'].id);

        return this.create(cartItemDecoded);
    }

    static validate(obj) {
        if (obj === null) return false;

        let requiredProperties = [
            'product',
            'quantity'
        ];

        if (requiredProperties.every(prop => prop in obj) === false) {
            console.error('Validation error, no such required props in given object');
            return false;
        }

        return true;
    }
}