import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Database, HardDrive, Settings, Shield, User } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Configurações',
        href: '/settings',
    },
];

const settingsCards = [
    {
        title: 'Perfil do Usuário',
        description: 'Gerencie suas informações pessoais, email e senha de acesso.',
        icon: User,
        href: '/settings/profile',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        features: [
            'Alterar nome e email',
            'Trocar senha de acesso',
            'Configurações de conta',
            'Informações pessoais'
        ]
    },
    {
        title: 'Sistema',
        description: 'Informações sobre o sistema, versões e estatísticas de uso.',
        icon: Settings,
        href: '/settings/system',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        features: [
            'Informações do sistema',
            'Versões instaladas',
            'Estatísticas de uso',
            'Status do servidor'
        ]
    },
    {
        title: 'Backup e Segurança',
        description: 'Configurações de backup, segurança e manutenção do sistema.',
        icon: Shield,
        href: '/settings/backup',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        features: [
            'Backup automático',
            'Configurações de segurança',
            'Logs do sistema',
            'Manutenção preventiva'
        ]
    }
];

export default function SettingsIndex() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Configurações - Venda Fácil" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Configurações</h1>
                        <p className="text-muted-foreground">
                            Gerencie as configurações do sistema e sua conta
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Settings className="h-8 w-8 text-muted-foreground" />
                    </div>
                </div>

                {/* Description */}
                <Card>
                    <CardHeader>
                        <CardTitle>Central de Configurações</CardTitle>
                        <CardDescription>
                            Acesse as configurações do sistema, gerencie seu perfil e configure 
                            opções de segurança e backup para manter seu sistema funcionando perfeitamente.
                        </CardDescription>
                    </CardHeader>
                </Card>

                {/* Settings Cards */}
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
                    {settingsCards.map((setting) => (
                        <Card key={setting.href} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className={`w-12 h-12 rounded-lg ${setting.bgColor} flex items-center justify-center mb-4`}>
                                    <setting.icon className={`h-6 w-6 ${setting.color}`} />
                                </div>
                                <CardTitle className="text-xl">{setting.title}</CardTitle>
                                <CardDescription className="text-sm">
                                    {setting.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium mb-2">Funcionalidades:</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        {setting.features.map((feature, index) => (
                                            <li key={index} className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-current rounded-full" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <Button asChild className="w-full">
                                    <Link href={setting.href}>
                                        Acessar Configurações
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* System Status */}
                <Card>
                    <CardHeader>
                        <CardTitle>Status do Sistema</CardTitle>
                        <CardDescription>
                            Informações rápidas sobre o estado atual do sistema
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <div>
                                    <p className="font-medium text-green-800">Sistema Online</p>
                                    <p className="text-sm text-green-600">Funcionando normalmente</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                <Database className="h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="font-medium text-blue-800">Banco de Dados</p>
                                    <p className="text-sm text-blue-600">Conectado e operacional</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                                <HardDrive className="h-5 w-5 text-purple-600" />
                                <div>
                                    <p className="font-medium text-purple-800">Armazenamento</p>
                                    <p className="text-sm text-purple-600">Espaço disponível</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Ações Rápidas</CardTitle>
                        <CardDescription>
                            Acesse rapidamente as configurações mais utilizadas
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Button variant="outline" asChild className="h-auto p-4">
                                <Link href="/settings/profile" className="flex flex-col items-center gap-2">
                                    <User className="h-6 w-6" />
                                    <span className="text-sm">Meu Perfil</span>
                                </Link>
                            </Button>
                            <Button variant="outline" asChild className="h-auto p-4">
                                <Link href="/settings/system" className="flex flex-col items-center gap-2">
                                    <Settings className="h-6 w-6" />
                                    <span className="text-sm">Info Sistema</span>
                                </Link>
                            </Button>
                            <Button variant="outline" asChild className="h-auto p-4">
                                <Link href="/settings/backup" className="flex flex-col items-center gap-2">
                                    <Shield className="h-6 w-6" />
                                    <span className="text-sm">Backup</span>
                                </Link>
                            </Button>
                            <Button variant="outline" asChild className="h-auto p-4">
                                <Link href="/dashboard" className="flex flex-col items-center gap-2">
                                    <Database className="h-6 w-6" />
                                    <span className="text-sm">Dashboard</span>
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Help Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Precisa de Ajuda?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <h4 className="font-medium text-blue-600">📚 Documentação</h4>
                                <p className="text-sm text-muted-foreground">
                                    Consulte nossa documentação completa para aprender a usar 
                                    todas as funcionalidades do sistema.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-medium text-green-600">🛠️ Suporte Técnico</h4>
                                <p className="text-sm text-muted-foreground">
                                    Entre em contato com nossa equipe de suporte para resolver 
                                    problemas técnicos ou tirar dúvidas.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
