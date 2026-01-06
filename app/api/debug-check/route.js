import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function GET() {
    const checks = {};

    try {
        checks.productsCount = await prisma.product.count();
        checks.productsStatus = 'OK';
    } catch (e) {
        checks.productsStatus = 'ERROR: ' + e.message;
    }

    try {
        checks.homeConfig = await prisma.homeConfig.findFirst();
        checks.homeConfigStatus = 'OK';
    } catch (e) {
        checks.homeConfigStatus = 'ERROR: ' + e.message;
    }

    try {
        checks.popupConfig = await prisma.popupConfig.findFirst();
        checks.popupConfigStatus = 'OK';
    } catch (e) {
        checks.popupConfigStatus = 'ERROR: ' + e.message;
    }

    return NextResponse.json(checks);
}
