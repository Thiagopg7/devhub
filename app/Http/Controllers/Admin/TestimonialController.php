<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\TestimonialRequest;
use App\Models\Testimonial;
use App\Services\TestimonialService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TestimonialController extends Controller
{
    public function __construct(private readonly TestimonialService $service) {}

    public function index(Request $request): Response
    {
        $search = $request->input('q');
        $status = $request->input('status');

        $testimonials = Testimonial::ordered()
            ->when($search, fn ($q) => $q->where(fn ($sub) => $sub
                ->where('name', 'like', "%{$search}%")
                ->orWhere('company', 'like', "%{$search}%")))
            ->when($status !== null && $status !== '', fn ($q) => $q->where('is_active', $status === '1'))
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Testimonials/Index', [
            'testimonials' => $testimonials,
            'filter' => $request->only('q', 'status'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Testimonials/Form');
    }

    public function store(TestimonialRequest $request): RedirectResponse
    {
        $this->service->create(
            $request->validated(),
            $request->file('avatar_image'),
        );

        return redirect()->route('admin.testimonials.index')
            ->with('toast', ['title' => 'Sucesso!', 'message' => 'Depoimento criado com sucesso.', 'type' => 'success']);
    }

    public function edit(Testimonial $testimonial): Response
    {
        return Inertia::render('Admin/Testimonials/Form', [
            'testimonial' => $testimonial,
        ]);
    }

    public function update(TestimonialRequest $request, Testimonial $testimonial): RedirectResponse
    {
        $this->service->update(
            $testimonial,
            $request->validated(),
            $request->file('avatar_image'),
        );

        return redirect()->route('admin.testimonials.index')
            ->with('toast', ['title' => 'Sucesso!', 'message' => 'Depoimento atualizado com sucesso.', 'type' => 'success']);
    }

    public function destroy(Testimonial $testimonial): RedirectResponse
    {
        $this->service->delete($testimonial);

        return back()->with('toast', ['title' => 'Sucesso!', 'message' => 'Depoimento excluído com sucesso.', 'type' => 'success']);
    }
}
