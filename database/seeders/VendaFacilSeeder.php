<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class VendaFacilSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Criar alguns clientes de exemplo
        \App\Models\Customer::create([
            'nome' => 'João Silva',
            'email' => 'joao@email.com',
            'telefone' => '(11) 99999-9999',
            'cpf_cnpj' => '123.456.789-00',
            'endereco' => 'Rua das Flores, 123',
            'cidade' => 'São Paulo',
            'estado' => 'SP',
            'cep' => '01234-567',
        ]);

        \App\Models\Customer::create([
            'nome' => 'Maria Santos',
            'email' => 'maria@email.com',
            'telefone' => '(11) 88888-8888',
            'cpf_cnpj' => '987.654.321-00',
            'endereco' => 'Av. Principal, 456',
            'cidade' => 'Rio de Janeiro',
            'estado' => 'RJ',
            'cep' => '20000-000',
        ]);

        // Criar alguns produtos de exemplo
        \App\Models\Product::create([
            'nome' => 'Notebook Dell',
            'descricao' => 'Notebook Dell Inspiron 15 3000',
            'preco' => 2500.00,
            'categoria' => 'Eletrônicos',
            'estoque' => 10,
            'ativo' => true,
        ]);

        \App\Models\Product::create([
            'nome' => 'Mouse Logitech',
            'descricao' => 'Mouse óptico sem fio',
            'preco' => 89.90,
            'categoria' => 'Acessórios',
            'estoque' => 25,
            'ativo' => true,
        ]);

        \App\Models\Product::create([
            'nome' => 'Teclado Mecânico',
            'descricao' => 'Teclado mecânico RGB',
            'preco' => 299.99,
            'categoria' => 'Acessórios',
            'estoque' => 15,
            'ativo' => true,
        ]);
    }
}
