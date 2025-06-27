<?php

namespace App\Http\Controllers;

use App\Models\Installment;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        return Inertia::render('reports/index');
    }

    public function sales(Request $request)
    {
        $startDate = $request->get('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->get('end_date', now()->endOfMonth()->toDateString());
        $groupBy = $request->get('group_by', 'day'); // day, week, month

        // Vendas por período
        $salesQuery = Sale::whereBetween('data_venda', [$startDate, $endDate]);

        $totalSales = $salesQuery->sum('valor_final');
        $totalOrders = $salesQuery->count();
        $averageTicket = $totalOrders > 0 ? $totalSales / $totalOrders : 0;

        // Vendas por período (gráfico)
        $salesByPeriod = $this->getSalesByPeriod($startDate, $endDate, $groupBy);

        // Top produtos
        $topProducts = SaleItem::select('product_id', 'products.nome')
            ->selectRaw('SUM(quantidade) as total_vendido')
            ->selectRaw('SUM(subtotal) as receita_total')
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->join('sales', 'sale_items.sale_id', '=', 'sales.id')
            ->whereBetween('sales.data_venda', [$startDate, $endDate])
            ->groupBy('product_id', 'products.nome')
            ->orderByDesc('total_vendido')
            ->limit(10)
            ->get();

        // Top clientes
        $topCustomers = Sale::select('customer_id', 'customers.nome')
            ->selectRaw('COUNT(*) as total_compras')
            ->selectRaw('SUM(valor_final) as total_gasto')
            ->join('customers', 'sales.customer_id', '=', 'customers.id')
            ->whereBetween('data_venda', [$startDate, $endDate])
            ->groupBy('customer_id', 'customers.nome')
            ->orderByDesc('total_gasto')
            ->limit(10)
            ->get();

        // Status das vendas
        $salesByStatus = Sale::select('status')
            ->selectRaw('COUNT(*) as total')
            ->selectRaw('SUM(valor_final) as valor_total')
            ->whereBetween('data_venda', [$startDate, $endDate])
            ->groupBy('status')
            ->get();

        return Inertia::render('reports/sales', [
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'group_by' => $groupBy,
            ],
            'summary' => [
                'total_sales' => $totalSales,
                'total_orders' => $totalOrders,
                'average_ticket' => $averageTicket,
            ],
            'sales_by_period' => $salesByPeriod,
            'top_products' => $topProducts,
            'top_customers' => $topCustomers,
            'sales_by_status' => $salesByStatus,
        ]);
    }

    public function financial(Request $request)
    {
        $startDate = $request->get('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->get('end_date', now()->endOfMonth()->toDateString());

        // Receitas
        $totalReceived = Installment::where('status', 'pago')
            ->whereBetween('data_pagamento', [$startDate, $endDate])
            ->sum('valor');

        $totalPending = Installment::where('status', 'pendente')
            ->whereBetween('data_vencimento', [$startDate, $endDate])
            ->sum('valor');

        $totalOverdue = Installment::where('status', 'pendente')
            ->where('data_vencimento', '<', now()->toDateString())
            ->sum('valor');

        // Fluxo de caixa por mês
        $cashFlow = Installment::select(
                DB::raw('YEAR(data_vencimento) as year'),
                DB::raw('MONTH(data_vencimento) as month'),
                DB::raw('SUM(CASE WHEN status = "pago" THEN valor ELSE 0 END) as recebido'),
                DB::raw('SUM(CASE WHEN status = "pendente" THEN valor ELSE 0 END) as pendente')
            )
            ->whereBetween('data_vencimento', [$startDate, $endDate])
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        // Parcelas vencendo nos próximos 30 dias
        $upcomingInstallments = Installment::with(['sale.customer'])
            ->where('status', 'pendente')
            ->whereBetween('data_vencimento', [
                now()->toDateString(),
                now()->addDays(30)->toDateString()
            ])
            ->orderBy('data_vencimento')
            ->limit(10)
            ->get();

        return Inertia::render('reports/financial', [
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
            'summary' => [
                'total_received' => $totalReceived,
                'total_pending' => $totalPending,
                'total_overdue' => $totalOverdue,
            ],
            'cash_flow' => $cashFlow,
            'upcoming_installments' => $upcomingInstallments,
        ]);
    }

    public function inventory()
    {
        // Produtos com estoque baixo
        $lowStockProducts = Product::where('estoque', '<=', 5)
            ->where('ativo', true)
            ->orderBy('estoque')
            ->get();

        // Produtos mais vendidos
        $topSellingProducts = Product::select('products.*')
            ->selectRaw('COALESCE(SUM(sale_items.quantidade), 0) as total_vendido')
            ->leftJoin('sale_items', 'products.id', '=', 'sale_items.product_id')
            ->groupBy('products.id')
            ->orderByDesc('total_vendido')
            ->limit(10)
            ->get();

        // Produtos sem movimento
        $noMovementProducts = Product::select('products.*')
            ->leftJoin('sale_items', 'products.id', '=', 'sale_items.product_id')
            ->whereNull('sale_items.id')
            ->where('products.ativo', true)
            ->get();

        // Valor total do estoque
        $totalStockValue = Product::where('ativo', true)
            ->selectRaw('SUM(preco * estoque) as total')
            ->value('total') ?? 0;

        // Produtos por categoria
        $productsByCategory = Product::select('categoria')
            ->selectRaw('COUNT(*) as total')
            ->selectRaw('SUM(estoque) as total_estoque')
            ->selectRaw('SUM(preco * estoque) as valor_total')
            ->where('ativo', true)
            ->whereNotNull('categoria')
            ->groupBy('categoria')
            ->orderByDesc('total')
            ->get();

        return Inertia::render('reports/inventory', [
            'low_stock_products' => $lowStockProducts,
            'top_selling_products' => $topSellingProducts,
            'no_movement_products' => $noMovementProducts,
            'total_stock_value' => $totalStockValue,
            'products_by_category' => $productsByCategory,
        ]);
    }

    private function getSalesByPeriod($startDate, $endDate, $groupBy)
    {
        $format = match($groupBy) {
            'week' => '%Y-%u',
            'month' => '%Y-%m',
            default => '%Y-%m-%d'
        };

        return Sale::select(
                DB::raw("DATE_FORMAT(data_venda, '{$format}') as period"),
                DB::raw('COUNT(*) as total_orders'),
                DB::raw('SUM(valor_final) as total_sales')
            )
            ->whereBetween('data_venda', [$startDate, $endDate])
            ->groupBy('period')
            ->orderBy('period')
            ->get();
    }
}
