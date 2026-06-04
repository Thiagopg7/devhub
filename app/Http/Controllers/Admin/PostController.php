<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\PostRequest;
use App\Models\Category;
use App\Models\Post;
use App\Services\PostService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function __construct(private readonly PostService $postService) {}

    public function index(Request $request): Response
    {
        return Inertia::render('Admin/Posts/Index', [
            'posts' => $this->postService->getPaginated(
                20,
                $request->input('q'),
                $request->input('category') ? (int) $request->input('category') : null,
                $request->input('status'),
            ),
            'filter' => $request->only('q', 'category', 'status'),
            'trashedCount' => Post::onlyTrashed()->count(),
            'categories' => Category::active()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function trashed(): Response
    {
        return Inertia::render('Admin/Posts/Trashed', [
            'posts' => Post::onlyTrashed()
                ->with('deletedByUser:id,name')
                ->orderByDesc('deleted_at')
                ->paginate(20)
                ->through(fn ($p) => $p->makeVisible('deleted_at')),
        ]);
    }

    public function restore(int $id): RedirectResponse
    {
        Post::onlyTrashed()->findOrFail($id)->restore();

        return back()->with('toast', ['title' => 'Sucesso!', 'message' => 'Post restaurado.', 'type' => 'success']);
    }

    public function purge(int $id): RedirectResponse
    {
        $post = Post::onlyTrashed()->findOrFail($id);
        $this->postService->purge($post);

        return back()->with('toast', ['title' => 'Sucesso!', 'message' => 'Post excluído permanentemente.', 'type' => 'success']);
    }

    public function create()
    {
        return Inertia::render('Admin/Posts/Form', [
            'categories' => Category::active()->orderBy('name')->get(['id', 'name', 'color']),
        ]);
    }

    public function store(PostRequest $request)
    {
        $data = array_merge($request->validated(), ['user_id' => auth()->id()]);
        $this->postService->create($data, $request->file('banner_image'));

        return redirect()->route('admin.posts.index')->with('toast', [
            'title' => 'Sucesso!',
            'message' => 'Post criado com sucesso.',
            'type' => 'success',
        ]);
    }

    public function edit(Post $post)
    {
        return Inertia::render('Admin/Posts/Form', [
            'post' => $post,
            'categories' => Category::active()->orderBy('name')->get(['id', 'name', 'color']),
        ]);
    }

    public function update(PostRequest $request, Post $post)
    {
        $this->postService->update($post, $request->validated(), $request->file('banner_image'));

        return redirect()->route('admin.posts.index')->with('toast', [
            'title' => 'Sucesso!',
            'message' => 'Post atualizado com sucesso.',
            'type' => 'success',
        ]);
    }

    public function destroy(Post $post)
    {
        $this->postService->delete($post);

        return redirect()->route('admin.posts.index')->with('toast', [
            'title' => 'Sucesso!',
            'message' => 'Post excluído com sucesso.',
            'type' => 'success',
        ]);
    }
}
