import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, BarChart3, DollarSign, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Relatórios',
        href: '/reports',
    },
    {
        title: 'Vendas',
        href: '/reports/sales',
    },
];

interface SalesReportProps {
    filters: {
        start_date: string;
        end_date: string;
        group_by: string;
    };
    summary: {
        total_sales: number;
        total_orders: number;
        average_ticket: number;
    };
    sales_by_period: any[];
    top_products: any[];
    top_customers: any[];
    sales_by_status: any[];
}

export default function SalesReport({ 
    filters, 
    summary, 
    sales_by_period, 
    top_products, 
    top_customers, 
    sales_by_status 
}: SalesReportProps) {
    const [startDate, setStartDate] = useState(filters.start_date);
    const [endDate, setEndDate] = useState(filters.end_date);
    const [groupBy, setGroupBy] = useState(filters.group_by);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const handleFilter = () => {
        router.get('/reports/sales', {
            start_date: startDate,
            end_date: endDate,
            group_by: groupBy,
        });
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Relatório de Vendas - Venda Fácil" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Relatório de Vendas</h1>
                        <p className="text-muted-foreground">
                            Análise detalhada das vendas por período
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/reports">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar
                        </Link>
                    </Button>
                </div>

                {/* Filtros */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filtros</CardTitle>
                        <CardDescription>
                            Configure o período e agrupamento dos dados
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="text-sm font-medium">Data Início</label>
                                <Input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Data Fim</label>
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Agrupar por</label>
                                <Select value={groupBy} onValueChange={setGroupBy}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="day">Dia</SelectItem>
                                        <SelectItem value="week">Semana</SelectItem>
                                        <SelectItem value="month">Mês</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-end">
                                <Button onClick={handleFilter} className="w-full">
                                    Aplicar Filtros
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Resumo */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(summary.total_sales)}</div>
                            <p className="text-xs text-muted-foreground">
                                Faturamento total no período
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{summary.total_orders}</div>
                            <p className="text-xs text-muted-foreground">
                                Número de vendas realizadas
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(summary.average_ticket)}</div>
                            <p className="text-xs text-muted-foreground">
                                Valor médio por venda
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Top Produtos */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Top Produtos
                            </CardTitle>
                            <CardDescription>
                                Produtos mais vendidos no período
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {top_products.length > 0 ? (
                                <div className="space-y-3">
                                    {top_products.map((product: any, index: number) => (
                                        <div key={product.product_id} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{product.nome}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {product.total_vendido} unidades
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">{formatCurrency(product.receita_total)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-muted-foreground py-4">
                                    Nenhum produto vendido no período
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Top Clientes */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Top Clientes
                            </CardTitle>
                            <CardDescription>
                                Clientes que mais compraram no período
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {top_customers.length > 0 ? (
                                <div className="space-y-3">
                                    {top_customers.map((customer: any, index: number) => (
                                        <div key={customer.customer_id} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-medium text-green-600">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{customer.nome}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {customer.total_compras} compras
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">{formatCurrency(customer.total_gasto)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-muted-foreground py-4">
                                    Nenhuma venda no período
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Status das Vendas */}
                <Card>
                    <CardHeader>
                        <CardTitle>Status das Vendas</CardTitle>
                        <CardDescription>
                            Distribuição das vendas por status
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {sales_by_status.length > 0 ? (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Quantidade</TableHead>
                                            <TableHead>Valor Total</TableHead>
                                            <TableHead>Percentual</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sales_by_status.map((status: any) => (
                                            <TableRow key={status.status}>
                                                <TableCell>
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status.status)}`}>
                                                        {status.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="font-medium">{status.total}</TableCell>
                                                <TableCell>{formatCurrency(status.valor_total)}</TableCell>
                                                <TableCell>
                                                    {((status.total / summary.total_orders) * 100).toFixed(1)}%
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <p className="text-center text-muted-foreground py-4">
                                Nenhuma venda no período
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
