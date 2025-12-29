"use client";

import React from 'react';
import OrderOnWay from '../../../components/order-status/OrderOnWay';
import OrderDelivered from '../../../components/order-status/OrderDelivered';
import OrderCancelled from '../../../components/order-status/OrderCancelled';
import OrderPending from '../../../components/order-status/OrderPending';

export default function OrderDetailsPage({ params }) {
    const orderId = params.id;

    // Dispatcher Logic based on ID (Simulated)
    // 9842 -> A Caminho (Default)
    // 8650 -> Entregue
    // 7021 -> Cancelado
    // 1111 -> Pendente

    let content;
    switch (orderId) {
        case '8650':
            content = <OrderDelivered order={{ id: orderId }} />;
            break;
        case '7021':
            content = <OrderCancelled order={{ id: orderId }} />;
            break;
        case '1111':
            content = <OrderPending order={{ id: orderId }} />;
            break;
        case '9842':
        default:
            content = <OrderOnWay order={{ id: orderId }} />;
            break;
    }

    return content;
}
