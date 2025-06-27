import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Calendar, Save, ShoppingCart, User } from 'lucide-react';

interface Sale {
    id: number;
    customer: {
        id: number;
        nome: string;
    };
    customer_id: number;
    data_venda: string;
    desconto: number;
    observacoes?: string;
    status: string;
    total: number;
    valor_final: number;
}

interface Customer {
    id: number;
    nome: string;
    email?: string;
    telefone?: string;
}

interface SalesEditProps {
    sale: Sale;
    customers: Customer[];
}

export default function SalesEdit({ sale, customers }: SalesEditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Vendas',
            href: '/sales',
        },
        {
            title: `Venda #${sale.id}`,
            href: `/sales/${sale.id}`,
        },
        {
            title: 'Editar',
            href: `/sales/${sale.id}/edit`,
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        customer_id: sale.customer_id.toString(),
        data_venda: sale.data_venda,
        desconto: sale.desconto.toString(),
        observacoes: sale.observacoes || '',
        status: sale.status,
    });

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/sales/${sale.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar Venda #${sale.id} - Venda Fácil`} />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Editar Venda #{sale.id}</h1>
                        <p className="text-muted-foreground">
                            Atualize as informações da venda
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href={`/sales/${sale.id}`}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar
                        </Link>
                    </Button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Informações da Venda */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ShoppingCart className="h-5 w-5" />
                                    Informações da Venda
                                </CardTitle>
                                <CardDescription>
                                    Dados básicos da venda
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="customer_id">Cliente *</Label>
                                    <Select value={data.customer_id} onValueChange={(value) => setData('customer_id', value)}>
                                        <SelectTrigger className={errors.customer_id ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Selecione um cliente" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {customers.map((customer) => (
                                                <SelectItem key={customer.id} value={customer.id.toString()}>
                                                    {customer.nome} {customer.email && `(${customer.email})`}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.customer_id && (
                                        <p className="text-sm text-red-500 mt-1">{errors.customer_id}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="data_venda">Data da Venda *</Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                        <Input
                                            id="data_venda"
                                            type="date"
                                            value={data.data_venda}
                                            onChange={(e) => setData('data_venda', e.target.value)}
                                            className={`pl-10 ${errors.data_venda ? 'border-red-500' : ''}`}
                                        />
                                    </div>
                                    {errors.data_venda && (
                                        <p className="text-sm text-red-500 mt-1">{errors.data_venda}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="status">Status *</Label>
                                    <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                        <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Selecione o status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pendente">Pendente</SelectItem>
                                            <SelectItem value="pago">Pago</SelectItem>
                                            <SelectItem value="cancelado">Cancelado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && (
                                        <p className="text-sm text-red-500 mt-1">{errors.status}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="desconto">Desconto (R$)</Label>
                                    <Input
                                        id="desconto"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.desconto}
                                        onChange={(e) => setData('desconto', e.target.value)}
                                        placeholder="0,00"
                                        className={errors.desconto ? 'border-red-500' : ''}
                                    />
                                    {errors.desconto && (
                                        <p className="text-sm text-red-500 mt-1">{errors.desconto}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="observacoes">Observações</Label>
                                    <Textarea
                                        id="observacoes"
                                        value={data.observacoes}
                                        onChange={(e) => setData('observacoes', e.target.value)}
                                        placeholder="Observações sobre a venda..."
                                        rows={4}
                                        className={errors.observacoes ? 'border-red-500' : ''}
                                    />
                                    {errors.observacoes && (
                                        <p className="text-sm text-red-500 mt-1">{errors.observacoes}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Resumo da Venda */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Resumo da Venda
                                </CardTitle>
                                <CardDescription>
                                    Valores calculados automaticamente
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium text-muted-foreground">Subtotal:</span>
                                        <span className="text-sm font-medium">{formatCurrency(sale.total)}</span>
                                    </div>
                                    
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium text-muted-foreground">Desconto:</span>
                                        <span className="text-sm font-medium text-red-600">
                                            -{formatCurrency(parseFloat(data.desconto) || 0)}
                                        </span>
                                    </div>
                                    
                                    <div className="flex justify-between border-t pt-2">
                                        <span className="text-lg font-bold">Total:</span>
                                        <span className="text-lg font-bold text-green-600">
                                            {formatCurrency(sale.total - (parseFloat(data.desconto) || 0))}
                                        </span>
                                    </div>
                                </div>

                                <div className="text-sm text-muted-foreground">
                                    <p><strong>Nota:</strong> Os itens da venda não podem ser alterados após a criação. Para modificar produtos, cancele esta venda e crie uma nova.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-4 mt-6">
                        <Button type="button" variant="outline" asChild>
                            <Link href={`/sales/${sale.id}`}>Cancelar</Link>
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
