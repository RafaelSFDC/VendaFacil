import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, CreditCard, Edit, Package, ShoppingCart, Trash2, User } from 'lucide-react';

interface Sale {
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
    installments: Installment[];
    total: number;
    desconto: number;
    valor_final: number;
    status: string;
    data_venda: string;
    observacoes?: string;
    created_at: string;
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

interface Installment {
    id: number;
    numero_parcela: number;
    valor: number;
    data_vencimento: string;
    data_pagamento?: string;
    status: string;
}

interface SalesShowProps {
    sale: Sale;
}

export default function SalesShow({ sale }: SalesShowProps) {
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
            title: `Venda #${sale.id}`,
            href: `/sales/${sale.id}`,
        },
    ];

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const handleDelete = () => {
        if (confirm(`Tem certeza que deseja excluir a venda #${sale.id}?`)) {
            router.delete(`/sales/${sale.id}`);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pago':
                return 'bg-green-100 text-green-800';
            case 'pendente':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelado':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getInstallmentStatusColor = (status: string) => {
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Venda #${sale.id} - Venda Fácil`} />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Venda #{sale.id}</h1>
                        <p className="text-muted-foreground">
                            Realizada em {new Date(sale.data_venda).toLocaleDateString('pt-BR')}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/sales">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Voltar
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={`/sales/${sale.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                            </Link>
                        </Button>
                        <Button variant="outline" onClick={handleDelete}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Informações da Venda */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5" />
                                Informações da Venda
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">ID da Venda</p>
                                    <p className="text-sm">#{sale.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sale.status)}`}>
                                        {sale.status}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Data da Venda</p>
                                    <p className="text-sm">{new Date(sale.data_venda).toLocaleDateString('pt-BR')}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Vendedor</p>
                                    <p className="text-sm">{sale.user.name}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Subtotal</p>
                                    <p className="text-lg font-semibold">{formatCurrency(sale.total)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Desconto</p>
                                    <p className="text-lg font-semibold text-red-600">
                                        {sale.desconto > 0 ? `-${formatCurrency(sale.desconto)}` : '-'}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Valor Final</p>
                                <p className="text-2xl font-bold text-green-600">{formatCurrency(sale.valor_final)}</p>
                            </div>

                            {sale.observacoes && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Observações</p>
                                    <p className="text-sm text-muted-foreground">{sale.observacoes}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Informações do Cliente */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Cliente
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Nome</p>
                                <Link 
                                    href={`/customers/${sale.customer.id}`}
                                    className="text-lg font-semibold text-blue-600 hover:underline"
                                >
                                    {sale.customer.nome}
                                </Link>
                            </div>

                            {sale.customer.email && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">E-mail</p>
                                    <p className="text-sm">{sale.customer.email}</p>
                                </div>
                            )}

                            {sale.customer.telefone && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                                    <p className="text-sm">{sale.customer.telefone}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Itens da Venda */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Itens da Venda ({sale.items.length})
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
                                    {sale.items.map((item) => (
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

                {/* Parcelas */}
                {sale.installments.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Parcelas ({sale.installments.length})
                            </CardTitle>
                            <CardDescription>
                                Controle de pagamentos parcelados
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Parcela</TableHead>
                                            <TableHead>Valor</TableHead>
                                            <TableHead>Vencimento</TableHead>
                                            <TableHead>Pagamento</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sale.installments.map((installment) => (
                                            <TableRow key={installment.id}>
                                                <TableCell className="font-medium">
                                                    #{installment.numero_parcela}
                                                </TableCell>
                                                <TableCell>
                                                    {formatCurrency(installment.valor)}
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(installment.data_vencimento).toLocaleDateString('pt-BR')}
                                                </TableCell>
                                                <TableCell>
                                                    {installment.data_pagamento 
                                                        ? new Date(installment.data_pagamento).toLocaleDateString('pt-BR')
                                                        : '-'
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getInstallmentStatusColor(installment.status)}`}>
                                                        {installment.status}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Sem parcelas */}
                {sale.installments.length === 0 && (
                    <Card>
                        <CardContent className="text-center py-8">
                            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">
                                Esta venda foi realizada à vista (sem parcelamento).
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
