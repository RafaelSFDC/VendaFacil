import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Calendar, Minus, Package, Plus, Save, ShoppingCart, Trash2, User, RefreshCw, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Vendas',
        href: '/sales',
    },
    {
        title: 'Nova Venda',
        href: '/sales/create',
    },
];

interface Customer {
    id: number;
    nome: string;
    email?: string;
    telefone?: string;
}

interface Product {
    id: number;
    nome: string;
    preco: number;
    estoque: number;
}

interface CartItem {
    product_id: number;
    product: Product;
    quantidade: number;
    preco_unitario: number;
    subtotal: number;
}

interface Installment {
    valor: number;
    data_vencimento: string;
}

interface SalesCreateProps {
    customers: Customer[];
    products: Product[];
}

export default function SalesCreate({ customers, products }: SalesCreateProps) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(1);
    const [installments, setInstallments] = useState<Installment[]>([]);
    const [isCustomInstallments, setIsCustomInstallments] = useState<boolean>(false);

    const { data, setData, post, processing, errors } = useForm({
        customer_id: '',
        data_venda: new Date().toISOString().split('T')[0],
        desconto: '',
        observacoes: '',
        items: [] as any[],
        parcelas: [] as any[],
    });

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const addToCart = () => {
        if (!selectedProduct) return;

        const product = products.find(p => p.id.toString() === selectedProduct);
        if (!product) return;

        if (quantity > product.estoque) {
            alert(`Estoque insuficiente. Disponível: ${product.estoque}`);
            return;
        }

        const existingItem = cart.find(item => item.product_id === product.id);

        if (existingItem) {
            const newQuantity = existingItem.quantidade + quantity;
            if (newQuantity > product.estoque) {
                alert(`Estoque insuficiente. Disponível: ${product.estoque}`);
                return;
            }

            setCart(cart.map(item =>
                item.product_id === product.id
                    ? {
                        ...item,
                        quantidade: newQuantity,
                        subtotal: newQuantity * item.preco_unitario
                    }
                    : item
            ));
        } else {
            const newItem: CartItem = {
                product_id: product.id,
                product,
                quantidade: quantity,
                preco_unitario: product.preco,
                subtotal: quantity * product.preco,
            };
            setCart([...cart, newItem]);
        }

        setSelectedProduct('');
        setQuantity(1);
    };

    const updateCartItemQuantity = (productId: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }

        const product = products.find(p => p.id === productId);
        if (!product) return;

        if (newQuantity > product.estoque) {
            alert(`Estoque insuficiente. Disponível: ${product.estoque}`);
            return;
        }

        setCart(cart.map(item =>
            item.product_id === productId
                ? {
                    ...item,
                    quantidade: newQuantity,
                    subtotal: newQuantity * item.preco_unitario
                }
                : item
        ));
    };

    const removeFromCart = (productId: number) => {
        setCart(cart.filter(item => item.product_id !== productId));
    };

    const updateItemPrice = (productId: number, newPrice: number) => {
        setCart(cart.map(item =>
            item.product_id === productId
                ? {
                    ...item,
                    preco_unitario: newPrice,
                    subtotal: item.quantidade * newPrice
                }
                : item
        ));
    };

    const addInstallment = () => {
        setInstallments([...installments, { valor: 0, data_vencimento: '' }]);
    };

    const updateInstallment = (index: number, field: keyof Installment, value: string | number) => {
        const updatedInstallments = installments.map((installment, i) =>
            i === index ? { ...installment, [field]: value } : installment
        );

        // Se está editando o valor, redistribuir automaticamente o restante
        if (field === 'valor') {
            const newValue = typeof value === 'number' ? value : parseFloat(value.toString()) || 0;
            const total = getFinalValue();

            // Calcular valores já definidos (incluindo o que está sendo editado)
            const editedInstallment = { ...updatedInstallments[index], valor: newValue };
            const otherInstallments = updatedInstallments.filter((_, i) => i !== index);
            const remainingValue = total - newValue;
            const remainingCount = otherInstallments.length;

            if (remainingCount > 0 && remainingValue >= 0) {
                const valuePerRemaining = remainingValue / remainingCount;

                const finalInstallments = updatedInstallments.map((installment, i) => {
                    if (i === index) {
                        return editedInstallment;
                    }
                    return {
                        ...installment,
                        valor: valuePerRemaining
                    };
                });

                setInstallments(finalInstallments);
                setIsCustomInstallments(true);
                return;
            }
        }

        setInstallments(updatedInstallments);

        // Marcar como customizado quando o usuário edita uma parcela
        if (field === 'valor') {
            setIsCustomInstallments(true);
        }
    };

    const removeInstallment = (index: number) => {
        setInstallments(installments.filter((_, i) => i !== index));
    };

    const generateEqualInstallments = (numParcelas: number) => {
        const total = getTotal();
        const desconto = parseFloat(data.desconto) || 0;
        const valorFinal = total - desconto;
        const valorParcela = valorFinal / numParcelas;

        const newInstallments: Installment[] = [];
        for (let i = 0; i < numParcelas; i++) {
            const dataVencimento = new Date();
            dataVencimento.setMonth(dataVencimento.getMonth() + i + 1);

            newInstallments.push({
                valor: valorParcela,
                data_vencimento: dataVencimento.toISOString().split('T')[0],
            });
        }

        setInstallments(newInstallments);
        setIsCustomInstallments(false); // Reset para não customizado
    };



    const resetToEqualInstallments = () => {
        if (installments.length > 0) {
            generateEqualInstallments(installments.length);
        }
    };

    const getTotal = () => {
        return cart.reduce((sum, item) => sum + item.subtotal, 0);
    };

    const getFinalValue = () => {
        const total = getTotal();
        const desconto = parseFloat(data.desconto) || 0;
        return total - desconto;
    };

    const getInstallmentsTotal = () => {
        return installments.reduce((sum, installment) => sum + (installment.valor || 0), 0);
    };

    const getInstallmentsDifference = () => {
        return getFinalValue() - getInstallmentsTotal();
    };

    const hasInstallmentsDifference = () => {
        const difference = Math.abs(getInstallmentsDifference());
        return difference > 0.01; // Tolerância de 1 centavo para arredondamentos
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (cart.length === 0) {
            alert('Adicione pelo menos um produto ao carrinho');
            return;
        }

        const formData = {
            ...data,
            items: cart.map(item => ({
                product_id: item.product_id,
                quantidade: item.quantidade,
                preco_unitario: item.preco_unitario,
            })),
            parcelas: installments.length > 0 ? installments : undefined,
        };

        // Atualizar os dados do form antes de enviar
        setData('items', formData.items);
        setData('parcelas', formData.parcelas || []);

        post('/sales');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nova Venda - Venda Fácil" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Nova Venda</h1>
                        <p className="text-muted-foreground">
                            Registre uma nova venda no sistema
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/sales">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar
                        </Link>
                    </Button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Informações da Venda */}
                        <div className="space-y-6 order-2 lg:order-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Informações da Venda
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="customer_id">Cliente *</Label>
                                        <Select value={data.customer_id} onValueChange={(value) => setData('customer_id', value)}>
                                            <SelectTrigger className={errors.customer_id ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Selecione um cliente" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {customers.map((customer) => (
                                                    <SelectItem key={customer.id} value={customer.id.toString()}>
                                                        {customer.nome} {customer.email && `(${customer.email})`}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.customer_id && (
                                            <p className="text-sm text-red-500 mt-1">{errors.customer_id}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="data_venda">Data da Venda *</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                            <Input
                                                id="data_venda"
                                                type="date"
                                                value={data.data_venda}
                                                onChange={(e) => setData('data_venda', e.target.value)}
                                                className={`pl-10 ${errors.data_venda ? 'border-red-500' : ''}`}
                                            />
                                        </div>
                                        {errors.data_venda && (
                                            <p className="text-sm text-red-500 mt-1">{errors.data_venda}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="desconto">Desconto (R$)</Label>
                                        <Input
                                            id="desconto"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.desconto}
                                            onChange={(e) => setData('desconto', e.target.value)}
                                            placeholder="0,00"
                                            className={errors.desconto ? 'border-red-500' : ''}
                                        />
                                        {errors.desconto && (
                                            <p className="text-sm text-red-500 mt-1">{errors.desconto}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="observacoes">Observações</Label>
                                        <Textarea
                                            id="observacoes"
                                            value={data.observacoes}
                                            onChange={(e) => setData('observacoes', e.target.value)}
                                            placeholder="Observações sobre a venda..."
                                            rows={3}
                                            className={errors.observacoes ? 'border-red-500' : ''}
                                        />
                                        {errors.observacoes && (
                                            <p className="text-sm text-red-500 mt-1">{errors.observacoes}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Adicionar Produto */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Package className="h-5 w-5" />
                                        Adicionar Produto
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="product">Produto</Label>
                                        <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione um produto" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {products.map((product) => (
                                                    <SelectItem key={product.id} value={product.id.toString()}>
                                                        {product.nome} - {formatCurrency(product.preco)} (Estoque: {product.estoque})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="quantity">Quantidade</Label>
                                        <Input
                                            id="quantity"
                                            type="number"
                                            min="1"
                                            value={quantity}
                                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                        />
                                    </div>

                                    <Button type="button" onClick={addToCart} disabled={!selectedProduct}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Adicionar ao Carrinho
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Carrinho e Resumo */}
                        <div className="space-y-6 order-1 lg:order-2">
                            {/* Carrinho */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <ShoppingCart className="h-5 w-5" />
                                        Carrinho ({cart.length} {cart.length === 1 ? 'item' : 'itens'})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {cart.length > 0 ? (
                                        <div className="space-y-4">
                                            {/* Desktop Table */}
                                            <div className="hidden md:block rounded-md border">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Produto</TableHead>
                                                            <TableHead>Qtd</TableHead>
                                                            <TableHead>Preço</TableHead>
                                                            <TableHead>Total</TableHead>
                                                            <TableHead></TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {cart.map((item) => (
                                                            <TableRow key={item.product_id}>
                                                                <TableCell className="font-medium">
                                                                    {item.product.nome}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="flex items-center gap-2">
                                                                        <Button
                                                                            type="button"
                                                                            size="sm"
                                                                            variant="outline"
                                                                            onClick={() => updateCartItemQuantity(item.product_id, item.quantidade - 1)}
                                                                        >
                                                                            <Minus className="h-3 w-3" />
                                                                        </Button>
                                                                        <span className="w-8 text-center">{item.quantidade}</span>
                                                                        <Button
                                                                            type="button"
                                                                            size="sm"
                                                                            variant="outline"
                                                                            onClick={() => updateCartItemQuantity(item.product_id, item.quantidade + 1)}
                                                                        >
                                                                            <Plus className="h-3 w-3" />
                                                                        </Button>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Input
                                                                        type="number"
                                                                        step="0.01"
                                                                        min="0"
                                                                        value={item.preco_unitario}
                                                                        onChange={(e) => updateItemPrice(item.product_id, parseFloat(e.target.value) || 0)}
                                                                        className="w-20"
                                                                    />
                                                                </TableCell>
                                                                <TableCell className="font-medium">
                                                                    {formatCurrency(item.subtotal)}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Button
                                                                        type="button"
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => removeFromCart(item.product_id)}
                                                                    >
                                                                        <Trash2 className="h-3 w-3" />
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>

                                            {/* Mobile Cards */}
                                            <div className="md:hidden space-y-3">
                                                {cart.map((item) => (
                                                    <div key={item.product_id} className="border rounded-lg p-4 space-y-3">
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex-1">
                                                                <h4 className="font-medium text-sm">{item.product.nome}</h4>
                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                    {formatCurrency(item.preco_unitario)} cada
                                                                </p>
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => removeFromCart(item.product_id)}
                                                                className="ml-2"
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                            </Button>
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm text-muted-foreground">Qtd:</span>
                                                                <Button
                                                                    type="button"
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => updateCartItemQuantity(item.product_id, item.quantidade - 1)}
                                                                >
                                                                    <Minus className="h-3 w-3" />
                                                                </Button>
                                                                <span className="w-8 text-center text-sm font-medium">{item.quantidade}</span>
                                                                <Button
                                                                    type="button"
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => updateCartItemQuantity(item.product_id, item.quantidade + 1)}
                                                                >
                                                                    <Plus className="h-3 w-3" />
                                                                </Button>
                                                            </div>

                                                            <div className="text-right">
                                                                <p className="text-xs text-muted-foreground">Total</p>
                                                                <p className="font-medium">{formatCurrency(item.subtotal)}</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm text-muted-foreground">Preço:</span>
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                min="0"
                                                                value={item.preco_unitario}
                                                                onChange={(e) => updateItemPrice(item.product_id, parseFloat(e.target.value) || 0)}
                                                                className="flex-1 text-sm"
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <ShoppingCart className="h-12 w-12 mx-auto mb-4" />
                                            <p>Carrinho vazio</p>
                                            <p className="text-sm">Adicione produtos para continuar</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Parcelas */}
                            {cart.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Parcelamento (Opcional)</CardTitle>
                                        <CardDescription>
                                            Configure as parcelas da venda
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex gap-2 flex-wrap">
                                            <Button type="button" size="sm" onClick={() => generateEqualInstallments(2)}>
                                                2x
                                            </Button>
                                            <Button type="button" size="sm" onClick={() => generateEqualInstallments(3)}>
                                                3x
                                            </Button>
                                            <Button type="button" size="sm" onClick={() => generateEqualInstallments(6)}>
                                                6x
                                            </Button>
                                            <Button type="button" size="sm" onClick={() => generateEqualInstallments(12)}>
                                                12x
                                            </Button>
                                            <Button type="button" size="sm" variant="outline" onClick={addInstallment}>
                                                <Plus className="mr-2 h-4 w-4" />
                                                Adicionar Parcela
                                            </Button>
                                            {isCustomInstallments && installments.length > 0 && (
                                                <Button type="button" size="sm" variant="outline" onClick={resetToEqualInstallments}>
                                                    <RefreshCw className="mr-2 h-4 w-4" />
                                                    Igualar Parcelas
                                                </Button>
                                            )}
                                        </div>

                                        {isCustomInstallments && (
                                            <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-2 rounded">
                                                <AlertTriangle className="h-4 w-4" />
                                                <span>Parcelas customizadas - valores editados manualmente</span>
                                            </div>
                                        )}

                                        {installments.length > 0 && (
                                            <div className="space-y-3">
                                                {/* Desktop Layout */}
                                                <div className="hidden md:block space-y-2">
                                                    {installments.map((installment, index) => (
                                                        <div key={index} className="flex gap-2 items-center">
                                                            <span className="text-sm w-16 font-medium">#{index + 1}</span>
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                min="0"
                                                                placeholder="Valor"
                                                                value={installment.valor}
                                                                onChange={(e) => updateInstallment(index, 'valor', parseFloat(e.target.value) || 0)}
                                                                className="flex-1"
                                                            />
                                                            <Input
                                                                type="date"
                                                                value={installment.data_vencimento}
                                                                onChange={(e) => updateInstallment(index, 'data_vencimento', e.target.value)}
                                                                className="flex-1"
                                                            />
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => removeInstallment(index)}
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Mobile Layout */}
                                                <div className="md:hidden space-y-3">
                                                    {installments.map((installment, index) => (
                                                        <div key={index} className="border rounded-lg p-3 space-y-3">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm font-medium">Parcela #{index + 1}</span>
                                                                <Button
                                                                    type="button"
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => removeInstallment(index)}
                                                                >
                                                                    <Trash2 className="h-3 w-3" />
                                                                </Button>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <div>
                                                                    <Label className="text-xs text-muted-foreground">Valor (R$)</Label>
                                                                    <Input
                                                                        type="number"
                                                                        step="0.01"
                                                                        min="0"
                                                                        placeholder="0,00"
                                                                        value={installment.valor}
                                                                        onChange={(e) => updateInstallment(index, 'valor', parseFloat(e.target.value) || 0)}
                                                                        className="text-sm"
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <Label className="text-xs text-muted-foreground">Data de Vencimento</Label>
                                                                    <Input
                                                                        type="date"
                                                                        value={installment.data_vencimento}
                                                                        onChange={(e) => updateInstallment(index, 'data_vencimento', e.target.value)}
                                                                        className="text-sm"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="space-y-2 pt-2 border-t">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-muted-foreground">Total das parcelas:</span>
                                                        <span className={hasInstallmentsDifference() ? 'text-red-600 font-medium' : 'text-muted-foreground'}>
                                                            {formatCurrency(getInstallmentsTotal())}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-muted-foreground">Valor da venda:</span>
                                                        <span className="text-muted-foreground">{formatCurrency(getFinalValue())}</span>
                                                    </div>
                                                    {hasInstallmentsDifference() && (
                                                        <div className="flex justify-between text-sm font-medium">
                                                            <span className="text-red-600">Diferença:</span>
                                                            <span className="text-red-600">
                                                                {getInstallmentsDifference() > 0 ? '+' : ''}{formatCurrency(getInstallmentsDifference())}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Resumo */}
                            {cart.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Resumo da Venda</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="flex justify-between">
                                            <span>Subtotal:</span>
                                            <span>{formatCurrency(getTotal())}</span>
                                        </div>
                                        {data.desconto && parseFloat(data.desconto) > 0 && (
                                            <div className="flex justify-between text-red-600">
                                                <span>Desconto:</span>
                                                <span>-{formatCurrency(parseFloat(data.desconto))}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-lg font-bold border-t pt-2">
                                            <span>Total:</span>
                                            <span>{formatCurrency(getFinalValue())}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-4 mt-6">
                        <Button type="button" variant="outline" asChild>
                            <Link href="/sales">Cancelar</Link>
                        </Button>
                        <Button type="submit" disabled={processing || cart.length === 0}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Salvando...' : 'Registrar Venda'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
