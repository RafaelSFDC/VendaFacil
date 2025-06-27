<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Installment extends Model
{
    protected $fillable = [
        'sale_id',
        'numero_parcela',
        'valor',
        'data_vencimento',
        'data_pagamento',
        'status',
        'observacoes',
        'observacoes_pagamento',
        'recibo',
    ];

    protected $casts = [
        'valor' => 'decimal:2',
        'data_vencimento' => 'date',
        'data_pagamento' => 'date',
    ];

    public function sale(): BelongsTo
    {
        return $this->belongsTo(Sale::class);
    }

    public function scopePendentes($query)
    {
        return $query->where('status', 'pendente');
    }

    public function scopeVencidas($query)
    {
        return $query->where('status', 'vencido')
                    ->orWhere(function ($query) {
                        $query->where('status', 'pendente')
                              ->where('data_vencimento', '<', now()->toDateString());
                    });
    }

    public function scopePagas($query)
    {
        return $query->where('status', 'pago');
    }
}
