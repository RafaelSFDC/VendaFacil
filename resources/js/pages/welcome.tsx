import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { BarChart3, CreditCard, Package, ShoppingCart, Users, Zap } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Venda Fácil - Sistema de Gestão de Vendas">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
                {/* Header */}
                <header className="container mx-auto px-4 py-6">
                    <nav className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Zap className="h-8 w-8 text-blue-600" />
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Venda Fácil</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            {auth.user ? (
                                <Button asChild>
                                    <Link href={route('dashboard')}>Ir para Dashboard</Link>
                                </Button>
                            ) : (
                                <>
                                    <Button variant="ghost" asChild>
                                        <Link href={route('login')}>Entrar</Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href={route('register')}>Cadastrar</Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                {/* Hero Section */}
                <main className="container mx-auto px-4 py-16">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Gerencie suas vendas com
                            <span className="text-blue-600"> facilidade</span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                            Sistema completo para gestão de vendas, clientes, produtos e parcelas. 
                            Controle total do seu negócio em uma plataforma simples e intuitiva.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {auth.user ? (
                                <Button size="lg" asChild>
                                    <Link href={route('dashboard')}>
                                        <BarChart3 className="mr-2 h-5 w-5" />
                                        Acessar Dashboard
                                    </Link>
                                </Button>
                            ) : (
                                <>
                                    <Button size="lg" asChild>
                                        <Link href={route('register')}>
                                            <Zap className="mr-2 h-5 w-5" />
                                            Começar Agora
                                        </Link>
                                    </Button>
                                    <Button size="lg" variant="outline" asChild>
                                        <Link href={route('login')}>Fazer Login</Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        <Card>
                            <CardHeader>
                                <Users className="h-10 w-10 text-blue-600 mb-2" />
                                <CardTitle>Gestão de Clientes</CardTitle>
                                <CardDescription>
                                    Cadastre e gerencie seus clientes com informações completas de contato e endereço.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Package className="h-10 w-10 text-green-600 mb-2" />
                                <CardTitle>Controle de Produtos</CardTitle>
                                <CardDescription>
                                    Organize seu estoque, categorias, preços e mantenha controle total dos seus produtos.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <ShoppingCart className="h-10 w-10 text-purple-600 mb-2" />
                                <CardTitle>Vendas Inteligentes</CardTitle>
                                <CardDescription>
                                    Registre vendas rapidamente com carrinho intuitivo e cálculos automáticos.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CreditCard className="h-10 w-10 text-orange-600 mb-2" />
                                <CardTitle>Parcelas Customizáveis</CardTitle>
                                <CardDescription>
                                    Configure parcelas personalizadas e gerencie pagamentos com datas e observações.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <BarChart3 className="h-10 w-10 text-red-600 mb-2" />
                                <CardTitle>Relatórios Completos</CardTitle>
                                <CardDescription>
                                    Acompanhe o desempenho do seu negócio com relatórios detalhados e estatísticas.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Zap className="h-10 w-10 text-yellow-600 mb-2" />
                                <CardTitle>Interface Moderna</CardTitle>
                                <CardDescription>
                                    Design responsivo e intuitivo que funciona perfeitamente em qualquer dispositivo.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>

                    {/* CTA Section */}
                    {!auth.user && (
                        <div className="text-center bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                Pronto para começar?
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Crie sua conta gratuita e comece a gerenciar suas vendas hoje mesmo.
                            </p>
                            <Button size="lg" asChild>
                                <Link href={route('register')}>
                                    Criar Conta Gratuita
                                </Link>
                            </Button>
                        </div>
                    )}
                </main>

                {/* Footer */}
                <footer className="container mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
                    <p>&copy; 2024 Venda Fácil. Sistema de gestão de vendas simples e eficiente.</p>
                </footer>
            </div>
        </>
    );
}
