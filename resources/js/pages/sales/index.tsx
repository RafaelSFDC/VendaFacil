import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Calendar, Edit, Eye, Plus, Search, ShoppingCart, Trash2 } from 'lucide-react';
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
];

interface Sale {
    id: number;
    customer: {
        id: number;
        nome: string;
    };
    user: {
        id: number;
        name: string;
    };
    total: number;
    desconto: number;
    valor_final: number;
    status: string;
    data_venda: string;
    created_at: string;
    items_count?: number;
    installments_count?: number;
}

interface SalesIndexProps {
    sales: {
        data: Sale[];
        links: any[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        status?: string;
        data_inicio?: string;
        data_fim?: string;
    };
}

export default function SalesIndex({ sales, filters }: SalesIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '#');
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
        router.get('/sales', {
            search,
            status: status === '#' ? undefined : status,
            data_inicio: dataInicio || undefined,
            data_fim: dataFim || undefined
        }, { preserveState: true });
    };

    const clearFilters = () => {
        setSearch('');
        setStatus('#');
        setDataInicio('');
        setDataFim('');
        router.get('/sales');
    };

    const handleDelete = (saleId: number) => {
        router.delete(`/sales/${saleId}`);
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

    const hasFilters = filters.search || filters.status || filters.data_inicio || filters.data_fim;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Vendas - Venda Fácil" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Vendas</h1>
                        <p className="text-muted-foreground">
                            Gerencie todas as vendas realizadas
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/sales/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Nova Venda
                        </Link>
                    </Button>
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md">
                        {flash.success}
                    </div>
                )}

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filtros</CardTitle>
                        <CardDescription>
                            Pesquise e filtre vendas por diferentes critérios
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Busca */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        placeholder="Buscar por cliente ou ID..."
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
                                        <SelectItem value="cancelado">Cancelado</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* Data Início */}
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        type="date"
                                        placeholder="Data início"
                                        value={dataInicio}
                                        onChange={(e) => setDataInicio(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>

                                {/* Data Fim */}
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        type="date"
                                        placeholder="Data fim"
                                        value={dataFim}
                                        onChange={(e) => setDataFim(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
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
                            <ShoppingCart className="h-5 w-5" />
                            Lista de Vendas ({sales.total})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {sales.data.length > 0 ? (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>ID</TableHead>
                                            <TableHead>Cliente</TableHead>
                                            <TableHead>Data</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Desconto</TableHead>
                                            <TableHead>Valor Final</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Vendedor</TableHead>
                                            <TableHead className="text-right">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sales.data.map((sale) => (
                                            <TableRow key={sale.id}>
                                                <TableCell className="font-medium">
                                                    #{sale.id}
                                                </TableCell>
                                                <TableCell>
                                                    <Link
                                                        href={`/customers/${sale.customer.id}`}
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        {sale.customer.nome}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(sale.data_venda).toLocaleDateString('pt-BR')}
                                                </TableCell>
                                                <TableCell>
                                                    {formatCurrency(sale.total)}
                                                </TableCell>
                                                <TableCell>
                                                    {sale.desconto > 0 ? formatCurrency(sale.desconto) : '-'}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {formatCurrency(sale.valor_final)}
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sale.status)}`}>
                                                        {sale.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    {sale.user.name}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button size="sm" variant="outline" asChild>
                                                            <Link href={`/sales/${sale.id}`}>
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button size="sm" variant="outline" asChild>
                                                            <Link href={`/sales/${sale.id}/edit`}>
                                                                <Edit className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button size="sm" variant="outline">
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Excluir venda</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Tem certeza que deseja excluir a venda #{sale.id}? Esta ação não pode ser desfeita.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleDelete(sale.id)} className="bg-red-600 hover:bg-red-700">
                                                                        Excluir
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground mb-4">
                                    {hasFilters
                                        ? 'Nenhuma venda encontrada com os filtros aplicados.'
                                        : 'Nenhuma venda registrada ainda.'
                                    }
                                </p>
                                {!hasFilters && (
                                    <Button asChild>
                                        <Link href="/sales/create">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Registrar Primeira Venda
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pagination */}
                {sales.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {sales.links.map((link, index) => (
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
