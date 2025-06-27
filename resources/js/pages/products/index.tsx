import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { AlertTriangle, Edit, Eye, Package, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Produtos',
        href: '/products',
    },
];

interface Product {
    id: number;
    nome: string;
    descricao?: string;
    preco: number;
    categoria?: string;
    estoque: number;
    ativo: boolean;
    created_at: string;
}

interface ProductsIndexProps {
    products: {
        data: Product[];
        links: any[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    categorias: string[];
    filters: {
        search?: string;
        categoria?: string;
        status?: string;
        estoque_baixo?: string;
    };
}

export default function ProductsIndex({ products, categorias, filters }: ProductsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [categoria, setCategoria] = useState(filters.categoria || '#');
    const [status, setStatus] = useState(filters.status || '#');
    const [estoqueBaixo, setEstoqueBaixo] = useState(filters.estoque_baixo || '#');
    const { flash } = usePage().props as any;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/products', {
            search,
            categoria: categoria === '#' ? undefined : categoria,
            status: status === '#' ? undefined : status,
            estoque_baixo: estoqueBaixo === '#' ? undefined : estoqueBaixo
        }, { preserveState: true });
    };

    const clearFilters = () => {
        setSearch('');
        setCategoria('#');
        setStatus('#');
        setEstoqueBaixo('#');
        router.get('/products');
    };

    const handleDelete = (product: Product) => {
        if (confirm(`Tem certeza que deseja excluir o produto ${product.nome}?`)) {
            router.delete(`/products/${product.id}`);
        }
    };

    const hasFilters = filters.search || filters.categoria || filters.status || filters.estoque_baixo;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Produtos - Venda Fácil" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Produtos</h1>
                        <p className="text-muted-foreground">
                            Gerencie seu catálogo de produtos
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/products/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Produto
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
                            Pesquise e filtre produtos por diferentes critérios
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Busca */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        placeholder="Buscar produtos..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>

                                {/* Categoria */}
                                <Select value={categoria} onValueChange={setCategoria}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Todas as categorias" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="#">Todas as categorias</SelectItem>
                                        {categorias.map((cat) => (
                                            <SelectItem key={cat} value={cat}>
                                                {cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* Status */}
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Todos os status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="#">Todos os status</SelectItem>
                                        <SelectItem value="ativo">Ativo</SelectItem>
                                        <SelectItem value="inativo">Inativo</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* Estoque Baixo */}
                                <Select value={estoqueBaixo} onValueChange={setEstoqueBaixo}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Estoque" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="#">Todos os estoques</SelectItem>
                                        <SelectItem value="1">Estoque baixo (≤5)</SelectItem>
                                    </SelectContent>
                                </Select>
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
                            <Package className="h-5 w-5" />
                            Lista de Produtos ({products.total})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {products.data.length > 0 ? (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Produto</TableHead>
                                            <TableHead>Categoria</TableHead>
                                            <TableHead>Preço</TableHead>
                                            <TableHead>Estoque</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Cadastrado</TableHead>
                                            <TableHead className="text-right">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {products.data.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{product.nome}</div>
                                                        {product.descricao && (
                                                            <div className="text-sm text-muted-foreground truncate max-w-xs">
                                                                {product.descricao}
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {product.categoria || '-'}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {formatCurrency(product.preco)}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        {product.estoque}
                                                        {product.estoque <= 5 && (
                                                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                        product.ativo
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {product.ativo ? 'Ativo' : 'Inativo'}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(product.created_at).toLocaleDateString('pt-BR')}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button size="sm" variant="outline" asChild>
                                                            <Link href={`/products/${product.id}`}>
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button size="sm" variant="outline" asChild>
                                                            <Link href={`/products/${product.id}/edit`}>
                                                                <Edit className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleDelete(product)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
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
                                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground mb-4">
                                    {hasFilters
                                        ? 'Nenhum produto encontrado com os filtros aplicados.'
                                        : 'Nenhum produto cadastrado ainda.'
                                    }
                                </p>
                                {!hasFilters && (
                                    <Button asChild>
                                        <Link href="/products/create">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Cadastrar Primeiro Produto
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pagination */}
                {products.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {products.links.map((link, index) => (
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
