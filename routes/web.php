<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InstallmentController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SaleController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('customers', CustomerController::class);
    Route::resource('products', ProductController::class);
    Route::resource('sales', SaleController::class);

    // Rotas para parcelas
    Route::get('installments', [InstallmentController::class, 'index'])->name('installments.index');
    Route::get('installments/{installment}', [InstallmentController::class, 'show'])->name('installments.show');
    Route::put('installments/{installment}', [InstallmentController::class, 'update'])->name('installments.update');
    Route::delete('installments/{installment}', [InstallmentController::class, 'destroy'])->name('installments.destroy');
    Route::post('installments/{installment}/mark-as-paid', [InstallmentController::class, 'markAsPaid'])->name('installments.mark-as-paid');
    Route::post('installments/mark-as-overdue', [InstallmentController::class, 'markAsOverdue'])->name('installments.mark-as-overdue');

    // Rotas para relatórios
    Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('reports/sales', [ReportController::class, 'sales'])->name('reports.sales');
    Route::get('reports/financial', [ReportController::class, 'financial'])->name('reports.financial');
    Route::get('reports/inventory', [ReportController::class, 'inventory'])->name('reports.inventory');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
