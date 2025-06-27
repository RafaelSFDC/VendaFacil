<?php

namespace App\Http\Controllers;

use App\Models\Installment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class InstallmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Installment::with(['sale.customer', 'sale.user']);

        // Busca por cliente ou número da parcela
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('numero_parcela', 'like', "%{$search}%")
                  ->orWhereHas('sale.customer', function ($customerQuery) use ($search) {
                      $customerQuery->where('nome', 'like', "%{$search}%");
                  });
            });
        }

        // Filtro por status
        if ($request->filled('status')) {
            $query->where('status', $request->get('status'));
        }

        // Filtro por vencimento
        if ($request->filled('vencimento')) {
            $vencimento = $request->get('vencimento');
            if ($vencimento === 'vencidas') {
                $query->where('data_vencimento', '<', now()->toDateString())
                      ->where('status', 'pendente');
            } elseif ($vencimento === 'hoje') {
                $query->where('data_vencimento', now()->toDateString());
            } elseif ($vencimento === 'proximos_7_dias') {
                $query->whereBetween('data_vencimento', [
                    now()->toDateString(),
                    now()->addDays(7)->toDateString()
                ]);
            }
        }

        // Filtro por período
        if ($request->filled('data_inicio')) {
            $query->where('data_vencimento', '>=', $request->get('data_inicio'));
        }
        if ($request->filled('data_fim')) {
            $query->where('data_vencimento', '<=', $request->get('data_fim'));
        }

        $installments = $query->orderBy('data_vencimento', 'asc')
                             ->paginate(15)
                             ->withQueryString();

        // Estatísticas rápidas
        $stats = [
            'total_pendente' => Installment::where('status', 'pendente')->sum('valor'),
            'total_vencidas' => Installment::where('status', 'pendente')
                                          ->where('data_vencimento', '<', now()->toDateString())
                                          ->sum('valor'),
            'vencendo_hoje' => Installment::where('data_vencimento', now()->toDateString())
                                         ->where('status', 'pendente')
                                         ->count(),
        ];

        return Inertia::render('installments/index', [
            'installments' => $installments,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status', 'vencimento', 'data_inicio', 'data_fim']),
        ]);
    }

    public function show(Installment $installment)
    {
        $installment->load(['sale.customer', 'sale.user', 'sale.items.product']);

        return Inertia::render('installments/show', [
            'installment' => $installment,
        ]);
    }

    public function markAsPaid(Request $request, Installment $installment)
    {
        $validated = $request->validate([
            'data_pagamento' => 'required|date',
            'observacoes_pagamento' => 'nullable|string|max:500',
        ]);

        DB::transaction(function () use ($installment, $validated) {
            $installment->update([
                'status' => 'pago',
                'data_pagamento' => $validated['data_pagamento'],
                'observacoes_pagamento' => $validated['observacoes_pagamento'] ?? null,
            ]);

            // Verificar se todas as parcelas da venda foram pagas
            $sale = $installment->sale;
            $totalInstallments = $sale->installments()->count();
            $paidInstallments = $sale->installments()->where('status', 'pago')->count();

            if ($totalInstallments === $paidInstallments) {
                $sale->update(['status' => 'pago']);
            }
        });

        return redirect()->back()->with('success', 'Parcela marcada como paga!');
    }

    public function markAsOverdue()
    {
        $overdue = Installment::where('status', 'pendente')
                             ->where('data_vencimento', '<', now()->toDateString())
                             ->update(['status' => 'vencido']);

        return redirect()->back()->with('success', "Marcadas {$overdue} parcelas como vencidas.");
    }

    public function update(Request $request, Installment $installment)
    {
        $validated = $request->validate([
            'valor' => 'required|numeric|min:0',
            'data_vencimento' => 'required|date',
            'observacoes_pagamento' => 'nullable|string|max:500',
        ]);

        $installment->update($validated);

        return redirect()->back()->with('success', 'Parcela atualizada com sucesso!');
    }

    public function destroy(Installment $installment)
    {
        $installment->delete();

        return redirect()->route('installments.index')
                        ->with('success', 'Parcela excluída com sucesso!');
    }
}
