import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from './schemas/cart.scheme';
import { Model } from 'mongoose';
import { ItemDTO } from 'src/user/dtos/item.dto';

@Injectable()
export class CartService {
    constructor(@InjectModel('Cart') private readonly cardModel: Model<CartDocument>) { }

    async createCart(userId: string, itemDTO: ItemDTO, subTotalPrice: number, totalPrice: number): Promise<Cart> {
        const newCart = await this.cardModel.create({
            userId,
            items: [{ ...itemDTO, subTotalPrice }],
            totalPrice
        })
        return newCart;
    }

    async getCart(userId: string): Promise<CartDocument> {
        const cart = await this.cardModel.findOne({ userId });
        return cart;
    }

    async deleteCart(userId: string): Promise<Cart> {
        const deleteCart = await this.cardModel.findOneAndDelete({ userId });
        return deleteCart;
    }

    private recaculateCart(cart: CartDocument) {
        cart.totalPrice = 0;
        cart.items.forEach(item => cart.totalPrice += item.quantity * item.price);
    }

    async addItemToCart(userId: string, itemDTO: ItemDTO): Promise<Cart> {
        const { productId, quantity, price } = itemDTO;
        const subTotalPrice = quantity * price;
        const cart = await this.getCart(userId);
        if (cart) {
            const itemIndex = cart.items.findIndex(item => item.productId === productId);
            if (itemIndex > -1) {
                const item = cart.items[itemIndex];
                cart.items[itemIndex] = {
                    ...item,
                    quantity: Number(item.quantity) + Number(quantity)
                };
                this.recaculateCart(cart);
                return cart.save();
            } else {
                cart.items.push({ ...itemDTO, subTotalPrice });
                this.recaculateCart(cart);
                return cart.save();
            }
        } else {
            const newCart = await this.createCart(userId, itemDTO, subTotalPrice, price);
            return newCart;
        }
    }

    async removeItemFromCart(userId: string, productId: string): Promise<any> {
        const cart = await this.getCart(userId);
        const itemIndex = cart.items.findIndex(item => item.productId === productId);
        if (itemIndex > -1) {
            cart.items.splice(itemIndex, 1);
            return cart.save();
        }
    }
}
