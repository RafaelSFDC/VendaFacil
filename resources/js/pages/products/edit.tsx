import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Package, Save } from 'lucide-react';

interface Product {
    id: number;
    nome: string;
    descricao?: string;
    preco: number;
    categoria?: string;
    estoque: number;
    ativo: boolean;
}

interface ProductsEditProps {
    product: Product;
}

export default function ProductsEdit({ product }: ProductsEditProps) {
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
        {
            title: 'Editar',
            href: `/products/${product.id}/edit`,
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        nome: product.nome || '',
        descricao: product.descricao || '',
        preco: product.preco.toString() || '',
        categoria: product.categoria || '',
        estoque: product.estoque.toString() || '',
        ativo: product.ativo,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/products/${product.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar ${product.nome} - Venda Fácil`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Editar Produto</h1>
                        <p className="text-muted-foreground">
                            Atualize as informações de {product.nome}
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href={`/products/${product.id}`}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar
                        </Link>
                    </Button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Informações Básicas */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Informações Básicas
                                </CardTitle>
                                <CardDescription>
                                    Dados principais do produto
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="nome">Nome do Produto *</Label>
                                    <Input
                                        id="nome"
                                        value={data.nome}
                                        onChange={(e) => setData('nome', e.target.value)}
                                        placeholder="Nome do produto"
                                        className={errors.nome ? 'border-red-500' : ''}
                                    />
                                    {errors.nome && (
                                        <p className="text-sm text-red-500 mt-1">{errors.nome}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="categoria">Categoria</Label>
                                    <Input
                                        id="categoria"
                                        value={data.categoria}
                                        onChange={(e) => setData('categoria', e.target.value)}
                                        placeholder="Ex: Eletrônicos, Roupas, Casa..."
                                        className={errors.categoria ? 'border-red-500' : ''}
                                    />
                                    {errors.categoria && (
                                        <p className="text-sm text-red-500 mt-1">{errors.categoria}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="descricao">Descrição</Label>
                                    <Textarea
                                        id="descricao"
                                        value={data.descricao}
                                        onChange={(e) => setData('descricao', e.target.value)}
                                        placeholder="Descrição detalhada do produto..."
                                        rows={4}
                                        className={errors.descricao ? 'border-red-500' : ''}
                                    />
                                    {errors.descricao && (
                                        <p className="text-sm text-red-500 mt-1">{errors.descricao}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Preço e Estoque */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Preço e Estoque</CardTitle>
                                <CardDescription>
                                    Informações comerciais do produto
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="preco">Preço de Venda *</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                                            R$
                                        </span>
                                        <Input
                                            id="preco"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.preco}
                                            onChange={(e) => setData('preco', e.target.value)}
                                            placeholder="0,00"
                                            className={`pl-10 ${errors.preco ? 'border-red-500' : ''}`}
                                        />
                                    </div>
                                    {errors.preco && (
                                        <p className="text-sm text-red-500 mt-1">{errors.preco}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="estoque">Quantidade em Estoque *</Label>
                                    <Input
                                        id="estoque"
                                        type="number"
                                        min="0"
                                        value={data.estoque}
                                        onChange={(e) => setData('estoque', e.target.value)}
                                        placeholder="0"
                                        className={errors.estoque ? 'border-red-500' : ''}
                                    />
                                    {errors.estoque && (
                                        <p className="text-sm text-red-500 mt-1">{errors.estoque}</p>
                                    )}
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Produtos com estoque ≤ 5 serão marcados como estoque baixo
                                    </p>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="ativo"
                                        checked={data.ativo}
                                        onCheckedChange={(checked) => setData('ativo', !!checked)}
                                    />
                                    <Label htmlFor="ativo" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Produto ativo
                                    </Label>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Produtos inativos não aparecerão nas vendas
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-4 mt-6">
                        <Button type="button" variant="outline" asChild>
                            <Link href={`/products/${product.id}`}>Cancelar</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Salvando...' : 'Salvar Alterações'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
