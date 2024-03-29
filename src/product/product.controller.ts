import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { FilterProductDTO } from './dtos/filter-product.dto';
import { CreateProductDTO } from './dtos/create-product.dto';

@Controller('store/products')
export class ProductController {
    constructor(private productService: ProductService) { }

    @Get('/')
    async getProducts(@Query() filteredProductDTO: FilterProductDTO) {
        if (Object.keys(filteredProductDTO).length) {
            const filteredProduct = await this.productService.getFilteredProducts(filteredProductDTO);
            return filteredProduct;
        } else {
            const allProducts = await this.productService.getAllProducts();
            return allProducts;
        }
    }

    @Get('/:id')
    async getProduct(@Param('id') id: string) {
        const product = await this.productService.getProduct(id);
        if (!product) throw new NotFoundException('Product does not exist');
        return product;
    }

    @Post('/')
    async addProduct(@Body() createProductDTO: CreateProductDTO) {
        const product = await this.productService.addProduct(createProductDTO);
        return product;
    }

    @Put('/:id')
    async updateProduct(@Param('id') id: string, @Body() createProductDTO: CreateProductDTO) {
        const product = await this.productService.updateProduct(id, createProductDTO);
        if (!product) throw new NotFoundException('')
    }

    @Delete('/:id')
    async deleteProduct(@Param('id') id: string) {
        const product = await this.productService.deleteProduct(id);
        if (!product) throw new NotFoundException('Product does not exist');
        return product;
    }
}
