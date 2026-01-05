import ProductDetails from '../product-detail';

export default async function Page({ params }) {
    const { id } = await params;
    return <ProductDetails id={id} />;
}
