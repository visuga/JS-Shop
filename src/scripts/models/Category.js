export default class Category {
    constructor({ title = '', id = 0 } = {}) {
        this.id = id;
        this.title = title;
    }

    toJson() {
        return JSON.stringify({
            title: this.title + ' serialized',
            id: this.id,
            savedDate: new Date(),
        });
    }

    static fromJson(jsonString) {
        let categoryDecoded = typeof jsonString === 'object' ? jsonString : JSON.parse(jsonString);

        if (!this.validate(categoryDecoded)) {
            return null;
        }

        return new this(categoryDecoded);
    }

    static validate(obj) {
        let requiredProperties = ['id', 'title'];

        if (requiredProperties.every(prop => prop in obj) === false) {
            console.error('Validation error, no such required props in given object');
            return false;
        }

        return true;
    }

    showMe() {
        console.log(`Hello, i'm category: ${this.title}`);
    }
}