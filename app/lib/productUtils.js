
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'app/data/products.json');

export function getProducts() {
    try {
        const fileData = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(fileData);
    } catch (error) {
        console.error("Error reading products:", error);
        return [];
    }
}

export function saveProducts(products) {
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 4));
        return true;
    } catch (error) {
        console.error("Error saving products:", error);
        return false;
    }
}

// Keep the old API signature if possible, but this is server-side only!
// The client-side 'products.js' can't use this.
