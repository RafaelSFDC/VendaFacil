import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { BarChart3, DollarSign, Package, TrendingUp } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Relatórios',
        href: '/reports',
    },
];

const reportCards = [
    {
        title: 'Relatório de Vendas',
        description: 'Análise detalhada das vendas por período, produtos mais vendidos e performance de vendedores.',
        icon: TrendingUp,
        href: '/reports/sales',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        features: [
            'Vendas por período (dia, semana, mês)',
            'Top produtos mais vendidos',
            'Top clientes por faturamento',
            'Status das vendas',
            'Gráficos interativos'
        ]
    },
    {
        title: 'Relatório Financeiro',
        description: 'Controle de fluxo de caixa, parcelas recebidas e análise de inadimplência.',
        icon: DollarSign,
        href: '/reports/financial',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        features: [
            'Fluxo de caixa mensal',
            'Parcelas recebidas vs pendentes',
            'Análise de inadimplência',
            'Parcelas vencendo',
            'Projeções de recebimento'
        ]
    },
    {
        title: 'Relatório de Estoque',
        description: 'Análise do inventário, produtos com estoque baixo e movimentação de produtos.',
        icon: Package,
        href: '/reports/inventory',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        features: [
            'Produtos com estoque baixo',
            'Produtos mais vendidos',
            'Produtos sem movimento',
            'Valor total do estoque',
            'Análise por categoria'
        ]
    }
];

export default function ReportsIndex() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Relatórios - Venda Fácil" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Relatórios</h1>
                        <p className="text-muted-foreground">
                            Análises detalhadas para tomada de decisão
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <BarChart3 className="h-8 w-8 text-muted-foreground" />
                    </div>
                </div>

                {/* Description */}
                <Card>
                    <CardHeader>
                        <CardTitle>Central de Relatórios</CardTitle>
                        <CardDescription>
                            Acesse relatórios detalhados sobre vendas, finanças e estoque para obter insights 
                            valiosos sobre seu negócio e tomar decisões estratégicas baseadas em dados.
                        </CardDescription>
                    </CardHeader>
                </Card>

                {/* Report Cards */}
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
                    {reportCards.map((report) => (
                        <Card key={report.href} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className={`w-12 h-12 rounded-lg ${report.bgColor} flex items-center justify-center mb-4`}>
                                    <report.icon className={`h-6 w-6 ${report.color}`} />
                                </div>
                                <CardTitle className="text-xl">{report.title}</CardTitle>
                                <CardDescription className="text-sm">
                                    {report.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium mb-2">Funcionalidades:</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        {report.features.map((feature, index) => (
                                            <li key={index} className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-current rounded-full" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <Button asChild className="w-full">
                                    <Link href={report.href}>
                                        Acessar Relatório
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Quick Stats */}
                <Card>
                    <CardHeader>
                        <CardTitle>Dicas para Usar os Relatórios</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <h4 className="font-medium text-blue-600">📊 Relatório de Vendas</h4>
                                <p className="text-sm text-muted-foreground">
                                    Use para identificar tendências de vendas, produtos em alta e 
                                    performance por período. Ideal para planejamento de estoque.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-medium text-green-600">💰 Relatório Financeiro</h4>
                                <p className="text-sm text-muted-foreground">
                                    Monitore seu fluxo de caixa, identifique clientes inadimplentes 
                                    e planeje recebimentos futuros.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-medium text-purple-600">📦 Relatório de Estoque</h4>
                                <p className="text-sm text-muted-foreground">
                                    Controle seu inventário, identifique produtos parados e 
                                    otimize suas compras.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Ações Rápidas</CardTitle>
                        <CardDescription>
                            Acesse rapidamente as funcionalidades mais utilizadas
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Button variant="outline" asChild className="h-auto p-4">
                                <Link href="/reports/sales?group_by=month" className="flex flex-col items-center gap-2">
                                    <TrendingUp className="h-6 w-6" />
                                    <span className="text-sm">Vendas Mensais</span>
                                </Link>
                            </Button>
                            <Button variant="outline" asChild className="h-auto p-4">
                                <Link href="/reports/financial" className="flex flex-col items-center gap-2">
                                    <DollarSign className="h-6 w-6" />
                                    <span className="text-sm">Fluxo de Caixa</span>
                                </Link>
                            </Button>
                            <Button variant="outline" asChild className="h-auto p-4">
                                <Link href="/reports/inventory" className="flex flex-col items-center gap-2">
                                    <Package className="h-6 w-6" />
                                    <span className="text-sm">Estoque Baixo</span>
                                </Link>
                            </Button>
                            <Button variant="outline" asChild className="h-auto p-4">
                                <Link href="/installments?vencimento=vencidas" className="flex flex-col items-center gap-2">
                                    <BarChart3 className="h-6 w-6" />
                                    <span className="text-sm">Parcelas Vencidas</span>
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
