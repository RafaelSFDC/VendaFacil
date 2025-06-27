import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Edit, Mail, MapPin, Phone, ShoppingCart, Trash2, User } from 'lucide-react';

interface Customer {
    id: number;
    nome: string;
    email?: string;
    telefone?: string;
    cpf_cnpj?: string;
    endereco?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
    observacoes?: string;
    created_at: string;
    sales?: Sale[];
}

interface Sale {
    id: number;
    data_venda: string;
    valor_final: number;
    status: string;
    items: SaleItem[];
    installments: Installment[];
}

interface SaleItem {
    id: number;
    quantidade: number;
    preco_unitario: number;
    subtotal: number;
    product: {
        id: number;
        nome: string;
    };
}

interface Installment {
    id: number;
    numero_parcela: number;
    valor: number;
    data_vencimento: string;
    data_pagamento?: string;
    status: string;
}

interface CustomersShowProps {
    customer: Customer;
}

export default function CustomersShow({ customer }: CustomersShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Clientes',
            href: '/customers',
        },
        {
            title: customer.nome,
            href: `/customers/${customer.id}`,
        },
    ];

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const handleDelete = () => {
        if (confirm(`Tem certeza que deseja excluir o cliente ${customer.nome}?`)) {
            router.delete(`/customers/${customer.id}`);
        }
    };

    const totalVendas = customer.sales?.reduce((sum, sale) => sum + sale.valor_final, 0) || 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${customer.nome} - Venda Fácil`} />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">{customer.nome}</h1>
                        <p className="text-muted-foreground">
                            Cliente desde {new Date(customer.created_at).toLocaleDateString('pt-BR')}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/customers">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Voltar
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={`/customers/${customer.id}/edit`}>
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
                    {/* Informações do Cliente */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Informações Pessoais
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Nome</p>
                                    <p className="text-sm">{customer.nome}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">CPF/CNPJ</p>
                                    <p className="text-sm">{customer.cpf_cnpj || '-'}</p>
                                </div>
                            </div>

                            {customer.email && (
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{customer.email}</span>
                                </div>
                            )}

                            {customer.telefone && (
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{customer.telefone}</span>
                                </div>
                            )}

                            {(customer.endereco || customer.cidade) && (
                                <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <div className="text-sm">
                                        {customer.endereco && <p>{customer.endereco}</p>}
                                        {customer.cidade && (
                                            <p>
                                                {customer.cidade}
                                                {customer.estado && `, ${customer.estado}`}
                                                {customer.cep && ` - ${customer.cep}`}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {customer.observacoes && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Observações</p>
                                    <p className="text-sm text-muted-foreground">{customer.observacoes}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Estatísticas */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5" />
                                Estatísticas de Vendas
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold">{customer.sales?.length || 0}</p>
                                    <p className="text-sm text-muted-foreground">Vendas Realizadas</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold">{formatCurrency(totalVendas)}</p>
                                    <p className="text-sm text-muted-foreground">Total Comprado</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Histórico de Vendas */}
                {customer.sales && customer.sales.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Histórico de Vendas</CardTitle>
                            <CardDescription>
                                Todas as vendas realizadas para este cliente
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Data</TableHead>
                                            <TableHead>Produtos</TableHead>
                                            <TableHead>Valor</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Parcelas</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {customer.sales.map((sale) => (
                                            <TableRow key={sale.id}>
                                                <TableCell>
                                                    {new Date(sale.data_venda).toLocaleDateString('pt-BR')}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        {sale.items.map((item) => (
                                                            <div key={item.id} className="text-sm">
                                                                {item.quantidade}x {item.product.nome}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {formatCurrency(sale.valor_final)}
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                        sale.status === 'pago' 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : sale.status === 'pendente'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {sale.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    {sale.installments.length > 0 ? (
                                                        <div className="text-sm">
                                                            {sale.installments.filter(i => i.status === 'pago').length}/
                                                            {sale.installments.length} pagas
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground">À vista</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Sem vendas */}
                {(!customer.sales || customer.sales.length === 0) && (
                    <Card>
                        <CardContent className="text-center py-8">
                            <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground mb-4">
                                Este cliente ainda não realizou nenhuma compra.
                            </p>
                            <Button asChild>
                                <Link href="/sales/create">
                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                    Nova Venda
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
