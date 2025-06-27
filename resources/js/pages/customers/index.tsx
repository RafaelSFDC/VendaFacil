import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Edit, Eye, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Clientes',
        href: '/customers',
    },
];

interface Customer {
    id: number;
    nome: string;
    email?: string;
    telefone?: string;
    cpf_cnpj?: string;
    cidade?: string;
    estado?: string;
    created_at: string;
}

interface CustomersIndexProps {
    customers: {
        data: Customer[];
        links: any[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
    };
}

export default function CustomersIndex({ customers, filters }: CustomersIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const { flash } = usePage().props as any;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/customers', { search }, { preserveState: true });
    };

    const handleDelete = (customerId: number) => {
        router.delete(`/customers/${customerId}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Clientes - Venda Fácil" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Clientes</h1>
                        <p className="text-muted-foreground">
                            Gerencie seus clientes cadastrados
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/customers/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Cliente
                        </Link>
                    </Button>
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md">
                        {flash.success}
                    </div>
                )}

                {/* Search */}
                <Card>
                    <CardHeader>
                        <CardTitle>Buscar Clientes</CardTitle>
                        <CardDescription>
                            Pesquise por nome, email, telefone ou CPF/CNPJ
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Digite para buscar..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Button type="submit">Buscar</Button>
                            {filters.search && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setSearch('');
                                        router.get('/customers');
                                    }}
                                >
                                    Limpar
                                </Button>
                            )}
                        </form>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Lista de Clientes ({customers.total})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {customers.data.length > 0 ? (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nome</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Telefone</TableHead>
                                            <TableHead>CPF/CNPJ</TableHead>
                                            <TableHead>Cidade/UF</TableHead>
                                            <TableHead>Cadastrado</TableHead>
                                            <TableHead className="text-right">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {customers.data.map((customer) => (
                                            <TableRow key={customer.id}>
                                                <TableCell className="font-medium">
                                                    {customer.nome}
                                                </TableCell>
                                                <TableCell>
                                                    {customer.email || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {customer.telefone || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {customer.cpf_cnpj || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {customer.cidade && customer.estado
                                                        ? `${customer.cidade}/${customer.estado}`
                                                        : customer.cidade || '-'
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(customer.created_at).toLocaleDateString('pt-BR')}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button size="sm" variant="outline" asChild>
                                                            <Link href={`/customers/${customer.id}`}>
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button size="sm" variant="outline" asChild>
                                                            <Link href={`/customers/${customer.id}/edit`}>
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
                                                                    <AlertDialogTitle>Excluir cliente</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Tem certeza que deseja excluir o cliente {customer.nome}? Esta ação não pode ser desfeita.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleDelete(customer.id)} className="bg-red-600 hover:bg-red-700">
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
                                <p className="text-muted-foreground">
                                    {filters.search
                                        ? 'Nenhum cliente encontrado com os critérios de busca.'
                                        : 'Nenhum cliente cadastrado ainda.'
                                    }
                                </p>
                                {!filters.search && (
                                    <Button className="mt-4" asChild>
                                        <Link href="/customers/create">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Cadastrar Primeiro Cliente
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pagination */}
                {customers.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {customers.links.map((link, index) => (
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
