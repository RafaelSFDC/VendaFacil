import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Clientes',
        href: '/customers',
    },
    {
        title: 'Novo Cliente',
        href: '/customers/create',
    },
];

export default function CustomersCreate() {
    const { data, setData, post, processing, errors } = useForm({
        nome: '',
        email: '',
        telefone: '',
        cpf_cnpj: '',
        endereco: '',
        cidade: '',
        estado: '',
        cep: '',
        observacoes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/customers');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Novo Cliente - Venda Fácil" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Novo Cliente</h1>
                        <p className="text-muted-foreground">
                            Cadastre um novo cliente no sistema
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/customers">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar
                        </Link>
                    </Button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Dados Pessoais */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Dados Pessoais</CardTitle>
                                <CardDescription>
                                    Informações básicas do cliente
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="nome">Nome *</Label>
                                    <Input
                                        id="nome"
                                        value={data.nome}
                                        onChange={(e) => setData('nome', e.target.value)}
                                        placeholder="Nome completo do cliente"
                                        className={errors.nome ? 'border-red-500' : ''}
                                    />
                                    {errors.nome && (
                                        <p className="text-sm text-red-500 mt-1">{errors.nome}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="email@exemplo.com"
                                        className={errors.email ? 'border-red-500' : ''}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="telefone">Telefone</Label>
                                    <Input
                                        id="telefone"
                                        value={data.telefone}
                                        onChange={(e) => setData('telefone', e.target.value)}
                                        placeholder="(11) 99999-9999"
                                        className={errors.telefone ? 'border-red-500' : ''}
                                    />
                                    {errors.telefone && (
                                        <p className="text-sm text-red-500 mt-1">{errors.telefone}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="cpf_cnpj">CPF/CNPJ</Label>
                                    <Input
                                        id="cpf_cnpj"
                                        value={data.cpf_cnpj}
                                        onChange={(e) => setData('cpf_cnpj', e.target.value)}
                                        placeholder="000.000.000-00 ou 00.000.000/0000-00"
                                        className={errors.cpf_cnpj ? 'border-red-500' : ''}
                                    />
                                    {errors.cpf_cnpj && (
                                        <p className="text-sm text-red-500 mt-1">{errors.cpf_cnpj}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Endereço */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Endereço</CardTitle>
                                <CardDescription>
                                    Informações de localização do cliente
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="endereco">Endereço</Label>
                                    <Input
                                        id="endereco"
                                        value={data.endereco}
                                        onChange={(e) => setData('endereco', e.target.value)}
                                        placeholder="Rua, número, complemento"
                                        className={errors.endereco ? 'border-red-500' : ''}
                                    />
                                    {errors.endereco && (
                                        <p className="text-sm text-red-500 mt-1">{errors.endereco}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="cidade">Cidade</Label>
                                        <Input
                                            id="cidade"
                                            value={data.cidade}
                                            onChange={(e) => setData('cidade', e.target.value)}
                                            placeholder="Nome da cidade"
                                            className={errors.cidade ? 'border-red-500' : ''}
                                        />
                                        {errors.cidade && (
                                            <p className="text-sm text-red-500 mt-1">{errors.cidade}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="estado">Estado</Label>
                                        <Input
                                            id="estado"
                                            value={data.estado}
                                            onChange={(e) => setData('estado', e.target.value)}
                                            placeholder="UF"
                                            maxLength={2}
                                            className={errors.estado ? 'border-red-500' : ''}
                                        />
                                        {errors.estado && (
                                            <p className="text-sm text-red-500 mt-1">{errors.estado}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="cep">CEP</Label>
                                    <Input
                                        id="cep"
                                        value={data.cep}
                                        onChange={(e) => setData('cep', e.target.value)}
                                        placeholder="00000-000"
                                        className={errors.cep ? 'border-red-500' : ''}
                                    />
                                    {errors.cep && (
                                        <p className="text-sm text-red-500 mt-1">{errors.cep}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Observações */}
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Observações</CardTitle>
                            <CardDescription>
                                Informações adicionais sobre o cliente
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div>
                                <Label htmlFor="observacoes">Observações</Label>
                                <Textarea
                                    id="observacoes"
                                    value={data.observacoes}
                                    onChange={(e) => setData('observacoes', e.target.value)}
                                    placeholder="Informações adicionais sobre o cliente..."
                                    rows={4}
                                    className={errors.observacoes ? 'border-red-500' : ''}
                                />
                                {errors.observacoes && (
                                    <p className="text-sm text-red-500 mt-1">{errors.observacoes}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-4 mt-6">
                        <Button type="button" variant="outline" asChild>
                            <Link href="/customers">Cancelar</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Salvando...' : 'Salvar Cliente'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
