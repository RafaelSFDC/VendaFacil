import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Calendar, CheckCircle, CreditCard, Edit, Package, ShoppingCart, Trash2, User } from 'lucide-react';
import { useState } from 'react';

interface Installment {
    id: number;
    numero_parcela: number;
    valor: number;
    data_vencimento: string;
    data_pagamento?: string;
    status: string;
    observacoes_pagamento?: string;
    sale: {
        id: number;
        customer: {
            id: number;
            nome: string;
            email?: string;
            telefone?: string;
        };
        user: {
            id: number;
            name: string;
        };
        items: SaleItem[];
        total: number;
        desconto: number;
        valor_final: number;
        data_venda: string;
    };
}

interface SaleItem {
    id: number;
    product: {
        id: number;
        nome: string;
    };
    quantidade: number;
    preco_unitario: number;
    subtotal: number;
}

interface InstallmentsShowProps {
    installment: Installment;
}

export default function InstallmentsShow({ installment }: InstallmentsShowProps) {
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Parcelas',
            href: '/installments',
        },
        {
            title: `Parcela #${installment.numero_parcela}`,
            href: `/installments/${installment.id}`,
        },
    ];

    const { data, setData, post, processing, errors } = useForm({
        data_pagamento: new Date().toISOString().split('T')[0],
        observacoes_pagamento: '',
    });

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const handleMarkAsPaid = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/installments/${installment.id}/mark-as-paid`, {
            onSuccess: () => {
                setShowPaymentForm(false);
            }
        });
    };

    const handleDelete = () => {
        if (confirm(`Tem certeza que deseja excluir a parcela #${installment.numero_parcela}?`)) {
            router.delete(`/installments/${installment.id}`);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pago':
                return 'bg-green-100 text-green-800';
            case 'pendente':
                return 'bg-yellow-100 text-yellow-800';
            case 'vencido':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const isOverdue = () => {
        return installment.status === 'pendente' && 
               new Date(installment.data_vencimento) < new Date();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Parcela #${installment.numero_parcela} - Venda Fácil`} />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Parcela #{installment.numero_parcela}</h1>
                        <p className="text-muted-foreground">
                            Vencimento: {new Date(installment.data_vencimento).toLocaleDateString('pt-BR')}
                            {isOverdue() && <span className="text-red-600 font-medium ml-2">(Vencida)</span>}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/installments">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Voltar
                            </Link>
                        </Button>
                        {installment.status === 'pendente' && (
                            <Button onClick={() => setShowPaymentForm(true)}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Marcar como Pago
                            </Button>
                        )}
                        <Button variant="outline" onClick={handleDelete}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Informações da Parcela */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Informações da Parcela
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Número</p>
                                    <p className="text-lg font-semibold">#{installment.numero_parcela}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(installment.status)}`}>
                                        {installment.status}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Valor</p>
                                    <p className="text-2xl font-bold text-green-600">{formatCurrency(installment.valor)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Vencimento</p>
                                    <p className={`text-lg font-semibold ${isOverdue() ? 'text-red-600' : ''}`}>
                                        {new Date(installment.data_vencimento).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                            </div>

                            {installment.data_pagamento && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Data do Pagamento</p>
                                    <p className="text-lg font-semibold text-green-600">
                                        {new Date(installment.data_pagamento).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                            )}

                            {installment.observacoes_pagamento && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Observações do Pagamento</p>
                                    <p className="text-sm text-muted-foreground">{installment.observacoes_pagamento}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Informações da Venda */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5" />
                                Venda Relacionada
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Venda</p>
                                <Link 
                                    href={`/sales/${installment.sale.id}`}
                                    className="text-lg font-semibold text-blue-600 hover:underline"
                                >
                                    Venda #{installment.sale.id}
                                </Link>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Cliente</p>
                                <Link 
                                    href={`/customers/${installment.sale.customer.id}`}
                                    className="text-lg font-semibold text-blue-600 hover:underline"
                                >
                                    {installment.sale.customer.nome}
                                </Link>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Data da Venda</p>
                                    <p className="text-sm">{new Date(installment.sale.data_venda).toLocaleDateString('pt-BR')}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Vendedor</p>
                                    <p className="text-sm">{installment.sale.user.name}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total da Venda</p>
                                    <p className="text-lg font-semibold">{formatCurrency(installment.sale.valor_final)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Itens</p>
                                    <p className="text-sm">{installment.sale.items.length} produto(s)</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Formulário de Pagamento */}
                {showPaymentForm && installment.status === 'pendente' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Registrar Pagamento</CardTitle>
                            <CardDescription>
                                Marque esta parcela como paga
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleMarkAsPaid} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="data_pagamento">Data do Pagamento *</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                            <Input
                                                id="data_pagamento"
                                                type="date"
                                                value={data.data_pagamento}
                                                onChange={(e) => setData('data_pagamento', e.target.value)}
                                                className={`pl-10 ${errors.data_pagamento ? 'border-red-500' : ''}`}
                                            />
                                        </div>
                                        {errors.data_pagamento && (
                                            <p className="text-sm text-red-500 mt-1">{errors.data_pagamento}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="valor_display">Valor da Parcela</Label>
                                        <Input
                                            id="valor_display"
                                            value={formatCurrency(installment.valor)}
                                            disabled
                                            className="bg-gray-50"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="observacoes_pagamento">Observações</Label>
                                    <Textarea
                                        id="observacoes_pagamento"
                                        value={data.observacoes_pagamento}
                                        onChange={(e) => setData('observacoes_pagamento', e.target.value)}
                                        placeholder="Observações sobre o pagamento (opcional)..."
                                        rows={3}
                                        className={errors.observacoes_pagamento ? 'border-red-500' : ''}
                                    />
                                    {errors.observacoes_pagamento && (
                                        <p className="text-sm text-red-500 mt-1">{errors.observacoes_pagamento}</p>
                                    )}
                                </div>

                                <div className="flex items-center gap-4">
                                    <Button type="submit" disabled={processing}>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        {processing ? 'Processando...' : 'Confirmar Pagamento'}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => setShowPaymentForm(false)}>
                                        Cancelar
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Itens da Venda */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Itens da Venda ({installment.sale.items.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Produto</TableHead>
                                        <TableHead>Quantidade</TableHead>
                                        <TableHead>Preço Unitário</TableHead>
                                        <TableHead>Subtotal</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {installment.sale.items.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <Link 
                                                    href={`/products/${item.product.id}`}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {item.product.nome}
                                                </Link>
                                            </TableCell>
                                            <TableCell>{item.quantidade}</TableCell>
                                            <TableCell>{formatCurrency(item.preco_unitario)}</TableCell>
                                            <TableCell className="font-medium">
                                                {formatCurrency(item.subtotal)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
