import {OrderItemType} from '@wizardcoder/bl-model/dist/order/order-item/order-item-type';

export type CartItemAction = OrderItemType | 'semester' | 'year' | 'cancel';
