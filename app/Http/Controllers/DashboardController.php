<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Installment;
use App\Models\Product;
use App\Models\Sale;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_customers' => Customer::count(),
            'total_products' => Product::count(),
            'total_sales' => Sale::count(),
            'sales_this_month' => Sale::whereMonth('data_venda', now()->month)
                                    ->whereYear('data_venda', now()->year)
                                    ->count(),
            'pending_installments' => Installment::pendentes()->count(),
            'overdue_installments' => Installment::vencidas()->count(),
            'monthly_revenue' => Sale::whereMonth('data_venda', now()->month)
                                   ->whereYear('data_venda', now()->year)
                                   ->sum('valor_final'),
            'low_stock_products' => Product::where('estoque', '<=', 5)->count(),
        ];

        $recent_sales = Sale::with(['customer', 'user'])
                           ->latest('data_venda')
                           ->take(5)
                           ->get();

        $upcoming_installments = Installment::with(['sale.customer'])
                                          ->pendentes()
                                          ->where('data_vencimento', '<=', now()->addDays(7))
                                          ->orderBy('data_vencimento')
                                          ->take(5)
                                          ->get();

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recent_sales' => $recent_sales,
            'upcoming_installments' => $upcoming_installments,
        ]);
    }
}
