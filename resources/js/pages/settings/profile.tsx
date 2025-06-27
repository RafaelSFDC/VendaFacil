import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Key, Save, User } from 'lucide-react';

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
        title: 'Perfil',
        href: '/settings/profile',
    },
];

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    created_at: string;
}

interface ProfileProps {
    user: User;
}

export default function Profile({ user }: ProfileProps) {
    const { flash } = usePage().props as any;

    const { data: profileData, setData: setProfileData, put: putProfile, processing: processingProfile, errors: profileErrors } = useForm({
        name: user.name,
        email: user.email,
    });

    const { data: passwordData, setData: setPasswordData, put: putPassword, processing: processingPassword, errors: passwordErrors, reset: resetPassword } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        putProfile('/settings/profile');
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        putPassword('/settings/password', {
            onSuccess: () => {
                resetPassword();
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Perfil - Venda Fácil" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Meu Perfil</h1>
                        <p className="text-muted-foreground">
                            Gerencie suas informações pessoais e configurações de conta
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/settings">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar
                        </Link>
                    </Button>
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md">
                        {flash.success}
                    </div>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Informações do Perfil */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Informações Pessoais
                            </CardTitle>
                            <CardDescription>
                                Atualize suas informações básicas de perfil
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleProfileSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Nome Completo *</Label>
                                    <Input
                                        id="name"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData('name', e.target.value)}
                                        placeholder="Seu nome completo"
                                        className={profileErrors.name ? 'border-red-500' : ''}
                                    />
                                    {profileErrors.name && (
                                        <p className="text-sm text-red-500 mt-1">{profileErrors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="email">E-mail *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) => setProfileData('email', e.target.value)}
                                        placeholder="seu@email.com"
                                        className={profileErrors.email ? 'border-red-500' : ''}
                                    />
                                    {profileErrors.email && (
                                        <p className="text-sm text-red-500 mt-1">{profileErrors.email}</p>
                                    )}
                                </div>

                                <div className="pt-4">
                                    <Button type="submit" disabled={processingProfile}>
                                        <Save className="mr-2 h-4 w-4" />
                                        {processingProfile ? 'Salvando...' : 'Salvar Alterações'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Alterar Senha */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Key className="h-5 w-5" />
                                Alterar Senha
                            </CardTitle>
                            <CardDescription>
                                Mantenha sua conta segura com uma senha forte
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="current_password">Senha Atual *</Label>
                                    <Input
                                        id="current_password"
                                        type="password"
                                        value={passwordData.current_password}
                                        onChange={(e) => setPasswordData('current_password', e.target.value)}
                                        placeholder="Digite sua senha atual"
                                        className={passwordErrors.current_password ? 'border-red-500' : ''}
                                    />
                                    {passwordErrors.current_password && (
                                        <p className="text-sm text-red-500 mt-1">{passwordErrors.current_password}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="password">Nova Senha *</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={passwordData.password}
                                        onChange={(e) => setPasswordData('password', e.target.value)}
                                        placeholder="Digite a nova senha"
                                        className={passwordErrors.password ? 'border-red-500' : ''}
                                    />
                                    {passwordErrors.password && (
                                        <p className="text-sm text-red-500 mt-1">{passwordErrors.password}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="password_confirmation">Confirmar Nova Senha *</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={passwordData.password_confirmation}
                                        onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                                        placeholder="Confirme a nova senha"
                                        className={passwordErrors.password_confirmation ? 'border-red-500' : ''}
                                    />
                                    {passwordErrors.password_confirmation && (
                                        <p className="text-sm text-red-500 mt-1">{passwordErrors.password_confirmation}</p>
                                    )}
                                </div>

                                <div className="pt-4">
                                    <Button type="submit" disabled={processingPassword}>
                                        <Key className="mr-2 h-4 w-4" />
                                        {processingPassword ? 'Alterando...' : 'Alterar Senha'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Informações da Conta */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informações da Conta</CardTitle>
                        <CardDescription>
                            Detalhes sobre sua conta no sistema
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">ID do Usuário</p>
                                <p className="text-sm">#{user.id}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Data de Cadastro</p>
                                <p className="text-sm">{new Date(user.created_at).toLocaleDateString('pt-BR')}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">E-mail Verificado</p>
                                <p className="text-sm">
                                    {user.email_verified_at ? (
                                        <span className="text-green-600">✓ Verificado</span>
                                    ) : (
                                        <span className="text-orange-600">⚠ Não verificado</span>
                                    )}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Status da Conta</p>
                                <p className="text-sm">
                                    <span className="text-green-600">✓ Ativa</span>
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Dicas de Segurança */}
                <Card>
                    <CardHeader>
                        <CardTitle>Dicas de Segurança</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <h4 className="font-medium text-blue-600">🔒 Senha Segura</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>• Use pelo menos 8 caracteres</li>
                                    <li>• Combine letras, números e símbolos</li>
                                    <li>• Evite informações pessoais</li>
                                    <li>• Troque regularmente</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-medium text-green-600">🛡️ Proteção da Conta</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>• Mantenha seu e-mail atualizado</li>
                                    <li>• Não compartilhe suas credenciais</li>
                                    <li>• Faça logout em computadores públicos</li>
                                    <li>• Monitore atividades suspeitas</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
