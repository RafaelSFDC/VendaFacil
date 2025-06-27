import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { AlertTriangle, Calendar, CheckCircle, CreditCard, DollarSign, Eye, Search, XCircle } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Parcelas',
        href: '/installments',
    },
];

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
        };
        user: {
            id: number;
            name: string;
        };
    };
}

interface Stats {
    total_pendente: number;
    total_vencidas: number;
    vencendo_hoje: number;
}

interface InstallmentsIndexProps {
    installments: {
        data: Installment[];
        links: any[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    stats: Stats;
    filters: {
        search?: string;
        status?: string;
        vencimento?: string;
        data_inicio?: string;
        data_fim?: string;
    };
}

export default function InstallmentsIndex({ installments, stats, filters }: InstallmentsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '#');
    const [vencimento, setVencimento] = useState(filters.vencimento || '#');
    const [dataInicio, setDataInicio] = useState(filters.data_inicio || '');
    const [dataFim, setDataFim] = useState(filters.data_fim || '');
    const { flash } = usePage().props as any;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/installments', {
            search,
            status: status === '#' ? undefined : status,
            vencimento: vencimento === '#' ? undefined : vencimento,
            data_inicio: dataInicio || undefined,
            data_fim: dataFim || undefined
        }, { preserveState: true });
    };

    const clearFilters = () => {
        setSearch('');
        setStatus('#');
        setVencimento('#');
        setDataInicio('');
        setDataFim('');
        router.get('/installments');
    };

    const markAsOverdue = () => {
        router.post('/installments/mark-as-overdue');
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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pago':
                return <CheckCircle className="h-4 w-4" />;
            case 'pendente':
                return <Calendar className="h-4 w-4" />;
            case 'vencido':
                return <XCircle className="h-4 w-4" />;
            default:
                return <AlertTriangle className="h-4 w-4" />;
        }
    };

    const isOverdue = (installment: Installment) => {
        return installment.status === 'pendente' &&
               new Date(installment.data_vencimento) < new Date();
    };

    const hasFilters = filters.search || filters.status || filters.vencimento || filters.data_inicio || filters.data_fim;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Parcelas - Venda Fácil" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Parcelas</h1>
                        <p className="text-muted-foreground">
                            Controle de pagamentos e vencimentos
                        </p>
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline">
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                Marcar Vencidas
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Marcar parcelas como vencidas</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Tem certeza que deseja marcar todas as parcelas vencidas? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={markAsOverdue}>
                                    Confirmar
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md">
                        {flash.success}
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Pendente</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.total_pendente)}</div>
                            <p className="text-xs text-muted-foreground">
                                Valor total em aberto
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Vencidas</CardTitle>
                            <XCircle className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{formatCurrency(stats.total_vencidas)}</div>
                            <p className="text-xs text-muted-foreground">
                                Valor em atraso
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Vencendo Hoje</CardTitle>
                            <Calendar className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">{stats.vencendo_hoje}</div>
                            <p className="text-xs text-muted-foreground">
                                Parcelas para hoje
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filtros</CardTitle>
                        <CardDescription>
                            Pesquise e filtre parcelas por diferentes critérios
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                {/* Busca */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        placeholder="Buscar por cliente..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>

                                {/* Status */}
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Todos os status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="#">Todos os status</SelectItem>
                                        <SelectItem value="pendente">Pendente</SelectItem>
                                        <SelectItem value="pago">Pago</SelectItem>
                                        <SelectItem value="vencido">Vencido</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* Vencimento */}
                                <Select value={vencimento} onValueChange={setVencimento}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Vencimento" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="#">Todos</SelectItem>
                                        <SelectItem value="vencidas">Vencidas</SelectItem>
                                        <SelectItem value="hoje">Hoje</SelectItem>
                                        <SelectItem value="proximos_7_dias">Próximos 7 dias</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* Data Início */}
                                <Input
                                    type="date"
                                    placeholder="Data início"
                                    value={dataInicio}
                                    onChange={(e) => setDataInicio(e.target.value)}
                                />

                                {/* Data Fim */}
                                <Input
                                    type="date"
                                    placeholder="Data fim"
                                    value={dataFim}
                                    onChange={(e) => setDataFim(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit">Filtrar</Button>
                                {hasFilters && (
                                    <Button type="button" variant="outline" onClick={clearFilters}>
                                        Limpar Filtros
                                    </Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Lista de Parcelas ({installments.total})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {installments.data.length > 0 ? (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Parcela</TableHead>
                                            <TableHead>Cliente</TableHead>
                                            <TableHead>Venda</TableHead>
                                            <TableHead>Valor</TableHead>
                                            <TableHead>Vencimento</TableHead>
                                            <TableHead>Pagamento</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {installments.data.map((installment) => (
                                            <TableRow key={installment.id} className={isOverdue(installment) ? 'bg-red-50' : ''}>
                                                <TableCell className="font-medium">
                                                    #{installment.numero_parcela}
                                                </TableCell>
                                                <TableCell>
                                                    <Link
                                                        href={`/customers/${installment.sale.customer.id}`}
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        {installment.sale.customer.nome}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    <Link
                                                        href={`/sales/${installment.sale.id}`}
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        Venda #{installment.sale.id}
                                                    </Link>
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {formatCurrency(installment.valor)}
                                                </TableCell>
                                                <TableCell>
                                                    <div className={isOverdue(installment) ? 'text-red-600 font-medium' : ''}>
                                                        {new Date(installment.data_vencimento).toLocaleDateString('pt-BR')}
                                                        {isOverdue(installment) && (
                                                            <span className="ml-1 text-xs">(Vencida)</span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {installment.data_pagamento
                                                        ? new Date(installment.data_pagamento).toLocaleDateString('pt-BR')
                                                        : '-'
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(installment.status)}`}>
                                                        {getStatusIcon(installment.status)}
                                                        {installment.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button size="sm" variant="outline" asChild>
                                                            <Link href={`/installments/${installment.id}`}>
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground mb-4">
                                    {hasFilters
                                        ? 'Nenhuma parcela encontrada com os filtros aplicados.'
                                        : 'Nenhuma parcela registrada ainda.'
                                    }
                                </p>
                                {!hasFilters && (
                                    <Button asChild>
                                        <Link href="/sales/create">
                                            <CreditCard className="mr-2 h-4 w-4" />
                                            Criar Primeira Venda
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pagination */}
                {installments.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {installments.links.map((link, index) => (
                            <Button
                                key={index}
                                variant={link.active ? "default" : "outline"}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
