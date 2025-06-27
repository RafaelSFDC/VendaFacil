<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
    protected $fillable = [
        'nome',
        'email',
        'telefone',
        'cpf_cnpj',
        'endereco',
        'cidade',
        'estado',
        'cep',
        'observacoes',
    ];

    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class);
    }
}
