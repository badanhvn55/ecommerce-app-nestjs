import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { FilterProductDTO } from './dtos/filter-product.dto';
import { CreateProductDTO } from './dtos/create-product.dto';

@Injectable()
export class ProductService {
    constructor(@InjectModel('Product') private readonly productModel: Model<ProductDocument>) { }

    async getFilteredProducts(filterProductDTO: FilterProductDTO): Promise<Product[]> {
        const { category, search } = filterProductDTO;
        let products = await this.getAllProducts();
        if (search) {
            products = products.filter(product =>
                product.name.includes(search) ||
                product.description.includes(search)
            );
        }

        if (category) {
            products = products.filter(product => product.category === category);
        }

        return products;
    }

    async getAllProducts(): Promise<Product[]> {
        const products = await this.productModel.find().exec();
        return products;
    }

    async getProduct(id: string): Promise<Product> {
        const product = await this.productModel.findById(id).exec();
        return product;
    }

    async addProduct(createProductDTO: CreateProductDTO): Promise<Product> {
        const newProduct = await this.productModel.create(createProductDTO);
        return newProduct.save();
    }

    async updateProduct(id: string, createProductDTO: CreateProductDTO): Promise<Product> {
        const updateProduct = await this.productModel.findByIdAndUpdate(id, createProductDTO, { new: true });
        return updateProduct;
    }

    async deleteProduct(id: string): Promise<any> {
        const deleteProduct = this.productModel.findByIdAndDelete(id);
        return deleteProduct;
    }
}
