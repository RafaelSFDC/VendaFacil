import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { AlertTriangle, BarChart3, CreditCard, DollarSign, Package, ShoppingCart, TrendingUp, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface DashboardProps {
    stats: {
        total_customers: number;
        total_products: number;
        total_sales: number;
        sales_this_month: number;
        pending_installments: number;
        overdue_installments: number;
        monthly_revenue: number;
        low_stock_products: number;
        revenue_growth: number;
        sales_growth: number;
    };
    sales_chart: any[];
    top_products: any[];
    recent_sales: any[];
    upcoming_installments: any[];
    low_stock_products: any[];
}

export default function Dashboard({ stats, sales_chart, top_products, recent_sales, upcoming_installments, low_stock_products }: DashboardProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - Venda Fácil" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Cards de Estatísticas */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_customers}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Produtos Cadastrados</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_products}</div>
                            {stats.low_stock_products > 0 && (
                                <p className="text-xs text-orange-600 flex items-center gap-1 mt-1">
                                    <AlertTriangle className="h-3 w-3" />
                                    {stats.low_stock_products} com estoque baixo
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Vendas Este Mês</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.sales_this_month}</div>
                            <p className="text-xs text-muted-foreground">
                                Total: {stats.total_sales} vendas
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.monthly_revenue)}</div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                Receita deste mês
                                {stats.revenue_growth !== 0 && (
                                    <span className={`text-xs ${stats.revenue_growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        ({stats.revenue_growth > 0 ? '+' : ''}{stats.revenue_growth.toFixed(1)}%)
                                    </span>
                                )}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Cards de Parcelas */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Parcelas Pendentes</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending_installments}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Parcelas Vencidas</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats.overdue_installments}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Top Produtos */}
                {top_products.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Top Produtos do Mês
                            </CardTitle>
                            <CardDescription>
                                Produtos mais vendidos este mês
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
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
                        </CardContent>
                    </Card>
                )}

                {/* Produtos com Estoque Baixo */}
                {low_stock_products.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-orange-500" />
                                Produtos com Estoque Baixo
                            </CardTitle>
                            <CardDescription>
                                Produtos que precisam de reposição (≤5 unidades)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {low_stock_products.map((product: any) => (
                                    <div key={product.id} className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">{product.nome}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {product.categoria || 'Sem categoria'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-medium ${product.estoque === 0 ? 'text-red-600' : 'text-orange-600'}`}>
                                                {product.estoque} unidades
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {formatCurrency(product.preco)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Seções de Listas */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Vendas Recentes */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Vendas Recentes</CardTitle>
                            <CardDescription>Últimas 5 vendas realizadas</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {recent_sales.length > 0 ? (
                                <div className="space-y-3">
                                    {recent_sales.map((sale: any) => (
                                        <div key={sale.id} className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium">{sale.customer.nome}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(sale.data_venda).toLocaleDateString('pt-BR')}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium">{formatCurrency(sale.valor_final)}</p>
                                                <p className="text-xs text-muted-foreground">{sale.status}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">Nenhuma venda encontrada</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Parcelas Próximas ao Vencimento */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Parcelas Próximas</CardTitle>
                            <CardDescription>Vencem nos próximos 7 dias</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {upcoming_installments.length > 0 ? (
                                <div className="space-y-3">
                                    {upcoming_installments.map((installment: any) => (
                                        <div key={installment.id} className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium">{installment.sale.customer.nome}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Parcela {installment.numero_parcela} - Vence em{' '}
                                                    {new Date(installment.data_vencimento).toLocaleDateString('pt-BR')}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium">{formatCurrency(installment.valor)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">Nenhuma parcela próxima ao vencimento</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
