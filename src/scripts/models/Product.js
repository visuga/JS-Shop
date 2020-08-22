import Category from "./Category";
import StoreService from "../storeService";

export default class Product {
    constructor({
                    id = 0,
                    title = '',
                    price = 0,
                    quantity = 0,
                    img = null,
                    description = '',
                    category = new Category()
    } = {}) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.quantity = quantity;
        this.img = img;
        this.assignCategory(category);
    }

    assignCategory(category) {
        if (!(category instanceof Category)) {
            console.error(`Can't assign category. Given object is not Category class`);
            this.category = undefined;

            return;
        }

        this.category = category;
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            price: this.price,
            quantity: this.quantity,
            img: this.img,
            category: this.category.toJson(),
        };
    }

    static fromJson(jsonString) {
        let productDecoded = typeof jsonString === 'object' ? jsonString : JSON.parse(jsonString);

        if (!this.validate(productDecoded)) {
            return null;
        }

        productDecoded['category'] = Category.fromJson(productDecoded['category']);

        return new this(productDecoded);
    }

    static validate(obj) {
        if (obj === null) return false;

        let requiredProperties = [
            'id',
            'title',
            'price',
            'quantity',
            'img',
            'category',
        ];

        if (requiredProperties.every(prop => prop in obj) === false) {
            console.error('Validation error, no such required props in given object');
            return false;
        }

        return true;
    }
}