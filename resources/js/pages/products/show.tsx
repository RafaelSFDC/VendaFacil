import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, BarChart3, Edit, Package, ShoppingCart, Trash2 } from 'lucide-react';

interface Product {
    id: number;
    nome: string;
    descricao?: string;
    preco: number;
    categoria?: string;
    estoque: number;
    ativo: boolean;
    created_at: string;
    sale_items?: SaleItem[];
}

interface SaleItem {
    id: number;
    quantidade: number;
    preco_unitario: number;
    subtotal: number;
    created_at: string;
    sale: {
        id: number;
        data_venda: string;
        valor_final: number;
        status: string;
        customer: {
            id: number;
            nome: string;
        };
    };
}

interface ProductsShowProps {
    product: Product;
}

export default function ProductsShow({ product }: ProductsShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Produtos',
            href: '/products',
        },
        {
            title: product.nome,
            href: `/products/${product.id}`,
        },
    ];

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const handleDelete = () => {
        router.delete(`/products/${product.id}`);
    };

    const totalVendido = product.sale_items?.reduce((sum, item) => sum + item.quantidade, 0) || 0;
    const receitaTotal = product.sale_items?.reduce((sum, item) => sum + item.subtotal, 0) || 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${product.nome} - Venda Fácil`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">{product.nome}</h1>
                        <p className="text-muted-foreground">
                            Cadastrado em {new Date(product.created_at).toLocaleDateString('pt-BR')}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/products">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Voltar
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={`/products/${product.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                            </Link>
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Excluir
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Excluir produto</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Tem certeza que deseja excluir o produto {product.nome}? Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                                        Excluir
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Informações do Produto */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Informações do Produto
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Nome</p>
                                    <p className="text-sm">{product.nome}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Categoria</p>
                                    <p className="text-sm">{product.categoria || '-'}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Preço</p>
                                    <p className="text-lg font-semibold">{formatCurrency(product.preco)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Estoque</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-lg font-semibold">{product.estoque}</p>
                                        {product.estoque <= 5 && (
                                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                                        )}
                                    </div>
                                    {product.estoque <= 5 && (
                                        <p className="text-xs text-orange-600">Estoque baixo</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Status</p>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    product.ativo
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {product.ativo ? 'Ativo' : 'Inativo'}
                                </span>
                            </div>

                            {product.descricao && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Descrição</p>
                                    <p className="text-sm text-muted-foreground">{product.descricao}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Estatísticas de Vendas */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Estatísticas de Vendas
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold">{totalVendido}</p>
                                    <p className="text-sm text-muted-foreground">Unidades Vendidas</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold">{formatCurrency(receitaTotal)}</p>
                                    <p className="text-sm text-muted-foreground">Receita Total</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Histórico de Vendas */}
                {product.sale_items && product.sale_items.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Histórico de Vendas</CardTitle>
                            <CardDescription>
                                Todas as vendas deste produto
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Data</TableHead>
                                            <TableHead>Cliente</TableHead>
                                            <TableHead>Quantidade</TableHead>
                                            <TableHead>Preço Unitário</TableHead>
                                            <TableHead>Subtotal</TableHead>
                                            <TableHead>Status da Venda</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {product.sale_items.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    {new Date(item.sale.data_venda).toLocaleDateString('pt-BR')}
                                                </TableCell>
                                                <TableCell>
                                                    <Link
                                                        href={`/customers/${item.sale.customer.id}`}
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        {item.sale.customer.nome}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>{item.quantidade}</TableCell>
                                                <TableCell>{formatCurrency(item.preco_unitario)}</TableCell>
                                                <TableCell className="font-medium">
                                                    {formatCurrency(item.subtotal)}
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                        item.sale.status === 'pago'
                                                            ? 'bg-green-100 text-green-800'
                                                            : item.sale.status === 'pendente'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {item.sale.status}
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

                {/* Sem vendas */}
                {(!product.sale_items || product.sale_items.length === 0) && (
                    <Card>
                        <CardContent className="text-center py-8">
                            <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground mb-4">
                                Este produto ainda não foi vendido.
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
