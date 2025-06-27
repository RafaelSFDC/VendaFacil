<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();

        // Busca por nome, descrição ou categoria
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('nome', 'like', "%{$search}%")
                  ->orWhere('descricao', 'like', "%{$search}%")
                  ->orWhere('categoria', 'like', "%{$search}%");
            });
        }

        // Filtro por categoria
        if ($request->filled('categoria')) {
            $query->where('categoria', $request->get('categoria'));
        }

        // Filtro por status (ativo/inativo)
        if ($request->filled('status')) {
            $status = $request->get('status');
            if ($status === 'ativo') {
                $query->where('ativo', true);
            } elseif ($status === 'inativo') {
                $query->where('ativo', false);
            }
        }

        // Filtro por estoque baixo
        if ($request->filled('estoque_baixo')) {
            $query->where('estoque', '<=', 5);
        }

        $products = $query->latest()->paginate(15)->withQueryString();

        // Buscar categorias para o filtro
        $categorias = Product::distinct()->pluck('categoria')->filter()->sort()->values();

        return Inertia::render('products/index', [
            'products' => $products,
            'categorias' => $categorias,
            'filters' => $request->only(['search', 'categoria', 'status', 'estoque_baixo']),
        ]);
    }

    public function create()
    {
        return Inertia::render('products/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'descricao' => 'nullable|string',
            'preco' => 'required|numeric|min:0',
            'categoria' => 'nullable|string|max:100',
            'estoque' => 'required|integer|min:0',
            'ativo' => 'boolean',
        ]);

        Product::create($validated);

        return redirect()->route('products.index')
                        ->with('success', 'Produto cadastrado com sucesso!');
    }

    public function show(Product $product)
    {
        $product->load(['saleItems.sale.customer']);

        return Inertia::render('products/show', [
            'product' => $product,
        ]);
    }

    public function edit(Product $product)
    {
        return Inertia::render('products/edit', [
            'product' => $product,
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'descricao' => 'nullable|string',
            'preco' => 'required|numeric|min:0',
            'categoria' => 'nullable|string|max:100',
            'estoque' => 'required|integer|min:0',
            'ativo' => 'boolean',
        ]);

        $product->update($validated);

        return redirect()->route('products.index')
                        ->with('success', 'Produto atualizado com sucesso!');
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('products.index')
                        ->with('success', 'Produto excluído com sucesso!');
    }
}
