<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Installment;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SaleController extends Controller
{
    public function index(Request $request)
    {
        $query = Sale::with(['customer', 'user', 'items.product', 'installments']);

        // Busca por cliente ou ID da venda
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                  ->orWhereHas('customer', function ($customerQuery) use ($search) {
                      $customerQuery->where('nome', 'like', "%{$search}%");
                  });
            });
        }

        // Filtro por status
        if ($request->filled('status')) {
            $query->where('status', $request->get('status'));
        }

        // Filtro por período
        if ($request->filled('data_inicio')) {
            $query->where('data_venda', '>=', $request->get('data_inicio'));
        }
        if ($request->filled('data_fim')) {
            $query->where('data_venda', '<=', $request->get('data_fim'));
        }

        $sales = $query->latest('data_venda')->paginate(15)->withQueryString();

        return Inertia::render('sales/index', [
            'sales' => $sales,
            'filters' => $request->only(['search', 'status', 'data_inicio', 'data_fim']),
        ]);
    }

    public function create()
    {
        $customers = Customer::orderBy('nome')->get(['id', 'nome', 'email', 'telefone']);
        $products = Product::ativo()->orderBy('nome')->get(['id', 'nome', 'preco', 'estoque']);

        return Inertia::render('sales/create', [
            'customers' => $customers,
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'data_venda' => 'required|date',
            'desconto' => 'nullable|numeric|min:0',
            'observacoes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantidade' => 'required|integer|min:1',
            'items.*.preco_unitario' => 'required|numeric|min:0',
            'parcelas' => 'nullable|array',
            'parcelas.*.valor' => 'required_with:parcelas|numeric|min:0',
            'parcelas.*.data_vencimento' => 'required_with:parcelas|date',
        ]);

        DB::transaction(function () use ($validated) {
            // Calcular totais
            $total = 0;
            foreach ($validated['items'] as $item) {
                $total += $item['quantidade'] * $item['preco_unitario'];
            }

            $desconto = $validated['desconto'] ?? 0;
            $valorFinal = $total - $desconto;

            // Criar a venda
            $sale = Sale::create([
                'customer_id' => $validated['customer_id'],
                'user_id' => Auth::id(),
                'total' => $total,
                'desconto' => $desconto,
                'valor_final' => $valorFinal,
                'status' => 'pendente',
                'data_venda' => $validated['data_venda'],
                'observacoes' => $validated['observacoes'],
            ]);

            // Criar os itens da venda
            foreach ($validated['items'] as $item) {
                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $item['product_id'],
                    'quantidade' => $item['quantidade'],
                    'preco_unitario' => $item['preco_unitario'],
                    'subtotal' => $item['quantidade'] * $item['preco_unitario'],
                ]);

                // Atualizar estoque
                $product = Product::find($item['product_id']);
                $product->decrement('estoque', $item['quantidade']);
            }

            // Criar parcelas se especificadas
            if (!empty($validated['parcelas'])) {
                foreach ($validated['parcelas'] as $index => $parcela) {
                    Installment::create([
                        'sale_id' => $sale->id,
                        'numero_parcela' => $index + 1,
                        'valor' => $parcela['valor'],
                        'data_vencimento' => $parcela['data_vencimento'],
                        'status' => 'pendente',
                    ]);
                }
            }
        });

        return redirect()->route('sales.index')
                        ->with('success', 'Venda registrada com sucesso!');
    }

    public function show(Sale $sale)
    {
        $sale->load(['customer', 'user', 'items.product', 'installments']);

        return Inertia::render('sales/show', [
            'sale' => $sale,
        ]);
    }

    public function edit(Sale $sale)
    {
        $sale->load(['items.product', 'installments']);
        $customers = Customer::orderBy('nome')->get(['id', 'nome', 'email', 'telefone']);
        $products = Product::ativo()->orderBy('nome')->get(['id', 'nome', 'preco', 'estoque']);

        return Inertia::render('sales/edit', [
            'sale' => $sale,
            'customers' => $customers,
            'products' => $products,
        ]);
    }

    public function update(Request $request, Sale $sale)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'data_venda' => 'required|date',
            'desconto' => 'nullable|numeric|min:0',
            'observacoes' => 'nullable|string',
            'status' => 'required|in:pendente,pago,cancelado',
        ]);

        $sale->update($validated);

        return redirect()->route('sales.index')
                        ->with('success', 'Venda atualizada com sucesso!');
    }

    public function destroy(Sale $sale)
    {
        DB::transaction(function () use ($sale) {
            // Restaurar estoque
            foreach ($sale->items as $item) {
                $product = Product::find($item->product_id);
                $product->increment('estoque', $item->quantidade);
            }

            $sale->delete();
        });

        return redirect()->route('sales.index')
                        ->with('success', 'Venda excluída com sucesso!');
    }
}
