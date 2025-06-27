import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Database, HardDrive, Server, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Configurações',
        href: '/settings',
    },
    {
        title: 'Sistema',
        href: '/settings/system',
    },
];

interface SystemStats {
    total_users: number;
    database_size: number;
    php_version: string;
    laravel_version: string;
    storage_used: number;
}

interface SystemProps {
    stats: SystemStats;
}

export default function System({ stats }: SystemProps) {
    const formatFileSize = (sizeInMB: number) => {
        if (sizeInMB < 1024) {
            return `${sizeInMB.toFixed(2)} MB`;
        }
        return `${(sizeInMB / 1024).toFixed(2)} GB`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sistema - Venda Fácil" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Informações do Sistema</h1>
                        <p className="text-muted-foreground">
                            Detalhes técnicos e estatísticas do sistema
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/settings">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar
                        </Link>
                    </Button>
                </div>

                {/* System Stats */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_users}</div>
                            <p className="text-xs text-muted-foreground">
                                Usuários cadastrados
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Banco de Dados</CardTitle>
                            <Database className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatFileSize(stats.database_size)}</div>
                            <p className="text-xs text-muted-foreground">
                                Tamanho do banco
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Armazenamento</CardTitle>
                            <HardDrive className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatFileSize(stats.storage_used)}</div>
                            <p className="text-xs text-muted-foreground">
                                Espaço utilizado
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Status</CardTitle>
                            <Server className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">Online</div>
                            <p className="text-xs text-muted-foreground">
                                Sistema operacional
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* System Information */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações Técnicas</CardTitle>
                            <CardDescription>
                                Versões e configurações do sistema
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">PHP</p>
                                    <p className="text-lg font-semibold">{stats.php_version}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Laravel</p>
                                    <p className="text-lg font-semibold">{stats.laravel_version}</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Ambiente</p>
                                    <p className="text-lg font-semibold">Produção</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Timezone</p>
                                    <p className="text-lg font-semibold">America/Sao_Paulo</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Status dos Serviços</CardTitle>
                            <CardDescription>
                                Estado atual dos componentes do sistema
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Servidor Web</span>
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    Online
                                </span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Banco de Dados</span>
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    Conectado
                                </span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Cache</span>
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    Ativo
                                </span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Sessões</span>
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    Funcionando
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* System Health */}
                <Card>
                    <CardHeader>
                        <CardTitle>Saúde do Sistema</CardTitle>
                        <CardDescription>
                            Indicadores de performance e estabilidade
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">99.9%</div>
                                <p className="text-sm text-green-700">Uptime</p>
                            </div>
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">&lt;100ms</div>
                                <p className="text-sm text-blue-700">Tempo de Resposta</p>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                                <div className="text-2xl font-bold text-purple-600">0</div>
                                <p className="text-sm text-purple-700">Erros Críticos</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Maintenance */}
                <Card>
                    <CardHeader>
                        <CardTitle>Manutenção</CardTitle>
                        <CardDescription>
                            Ferramentas de manutenção e otimização
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Button variant="outline" className="h-auto p-4">
                                <div className="flex flex-col items-center gap-2">
                                    <Database className="h-6 w-6" />
                                    <span className="text-sm">Limpar Cache</span>
                                </div>
                            </Button>
                            <Button variant="outline" className="h-auto p-4">
                                <div className="flex flex-col items-center gap-2">
                                    <HardDrive className="h-6 w-6" />
                                    <span className="text-sm">Otimizar DB</span>
                                </div>
                            </Button>
                            <Button variant="outline" className="h-auto p-4">
                                <div className="flex flex-col items-center gap-2">
                                    <Server className="h-6 w-6" />
                                    <span className="text-sm">Logs Sistema</span>
                                </div>
                            </Button>
                            <Button variant="outline" asChild className="h-auto p-4">
                                <Link href="/settings/backup" className="flex flex-col items-center gap-2">
                                    <Database className="h-6 w-6" />
                                    <span className="text-sm">Backup</span>
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
