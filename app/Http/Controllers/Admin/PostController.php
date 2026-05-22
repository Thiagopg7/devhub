<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\PostRequest;
use App\Models\Category;
use App\Models\Post;
use App\Services\PostService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    public function __construct(private readonly PostService $postService) {}

    public function index(Request $request)
    {
        return Inertia::render('Admin/Posts/Index', [
            'posts'  => $this->postService->getPaginated(20, $request->input('q')),
            'filter' => $request->only('q'),
        ]);
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
            'title'   => 'Sucesso!',
            'message' => 'Post criado com sucesso.',
            'type'    => 'success',
        ]);
    }

    public function edit(Post $post)
    {
        return Inertia::render('Admin/Posts/Form', [
            'post'       => $post,
            'categories' => Category::active()->orderBy('name')->get(['id', 'name', 'color']),
        ]);
    }

    public function update(PostRequest $request, Post $post)
    {
        $this->postService->update($post, $request->validated(), $request->file('banner_image'));

        return redirect()->route('admin.posts.index')->with('toast', [
            'title'   => 'Sucesso!',
            'message' => 'Post atualizado com sucesso.',
            'type'    => 'success',
        ]);
    }

    public function destroy(Post $post)
    {
        $this->postService->delete($post);

        return redirect()->route('admin.posts.index')->with('toast', [
            'title'   => 'Sucesso!',
            'message' => 'Post excluído com sucesso.',
            'type'    => 'success',
        ]);
    }
}
