<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Installment;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $currentMonth = now()->month;
        $currentYear = now()->year;
        $lastMonth = now()->subMonth()->month;
        $lastMonthYear = now()->subMonth()->year;

        // Estatísticas básicas
        $stats = [
            'total_customers' => Customer::count(),
            'total_products' => Product::count(),
            'total_sales' => Sale::count(),
            'sales_this_month' => Sale::whereMonth('data_venda', $currentMonth)
                                    ->whereYear('data_venda', $currentYear)
                                    ->count(),
            'pending_installments' => Installment::pendentes()->count(),
            'overdue_installments' => Installment::vencidas()->count(),
            'monthly_revenue' => Sale::whereMonth('data_venda', $currentMonth)
                                   ->whereYear('data_venda', $currentYear)
                                   ->sum('valor_final'),
            'low_stock_products' => Product::where('estoque', '<=', 5)->where('ativo', true)->count(),
        ];

        // Comparação com mês anterior
        $lastMonthRevenue = Sale::whereMonth('data_venda', $lastMonth)
                               ->whereYear('data_venda', $lastMonthYear)
                               ->sum('valor_final');

        $lastMonthSales = Sale::whereMonth('data_venda', $lastMonth)
                             ->whereYear('data_venda', $lastMonthYear)
                             ->count();

        $stats['revenue_growth'] = $lastMonthRevenue > 0
            ? (($stats['monthly_revenue'] - $lastMonthRevenue) / $lastMonthRevenue) * 100
            : 0;

        $stats['sales_growth'] = $lastMonthSales > 0
            ? (($stats['sales_this_month'] - $lastMonthSales) / $lastMonthSales) * 100
            : 0;

        // Vendas dos últimos 7 dias para gráfico
        $salesChart = Sale::select(
                DB::raw('DATE(data_venda) as date'),
                DB::raw('COUNT(*) as total_orders'),
                DB::raw('SUM(valor_final) as total_sales')
            )
            ->where('data_venda', '>=', now()->subDays(6)->startOfDay())
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Top produtos vendidos este mês
        $topProducts = SaleItem::select('product_id', 'products.nome')
            ->selectRaw('SUM(quantidade) as total_vendido')
            ->selectRaw('SUM(subtotal) as receita_total')
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->join('sales', 'sale_items.sale_id', '=', 'sales.id')
            ->whereMonth('sales.data_venda', $currentMonth)
            ->whereYear('sales.data_venda', $currentYear)
            ->groupBy('product_id', 'products.nome')
            ->orderByDesc('total_vendido')
            ->limit(5)
            ->get();

        // Vendas recentes
        $recent_sales = Sale::with(['customer', 'user'])
                           ->latest('data_venda')
                           ->take(5)
                           ->get();

        // Parcelas vencendo nos próximos 7 dias
        $upcoming_installments = Installment::with(['sale.customer'])
                                          ->pendentes()
                                          ->where('data_vencimento', '<=', now()->addDays(7))
                                          ->orderBy('data_vencimento')
                                          ->take(5)
                                          ->get();

        // Produtos com estoque baixo
        $low_stock_products = Product::where('estoque', '<=', 5)
                                   ->where('ativo', true)
                                   ->orderBy('estoque')
                                   ->take(5)
                                   ->get();

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'sales_chart' => $salesChart,
            'top_products' => $topProducts,
            'recent_sales' => $recent_sales,
            'upcoming_installments' => $upcoming_installments,
            'low_stock_products' => $low_stock_products,
        ]);
    }
}
