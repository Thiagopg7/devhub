<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\PostRequest;
use App\Models\Category;
use App\Models\Post;
use App\Services\FileUploadService;
use App\Services\PostService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PostController extends Controller
{
    public function __construct(
        private readonly PostService $postService,
        private readonly FileUploadService $uploadService,
    ) {}

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
        $data = $request->validated();

        try {
            if ($request->hasFile('banner_image')) {
                $data['banner_image'] = $this->uploadService->upload(
                    $request->file('banner_image'),
                    'posts'
                );
            }

            $this->postService->create($data);

            return redirect()->route('admin.posts.index')->with('toast', [
                'title'   => 'Sucesso!',
                'message' => 'Post criado com sucesso.',
                'type'    => 'success',
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao criar post', ['error' => $e->getMessage()]);
            return redirect()->back()->withInput()->with('toast', [
                'title'   => 'Erro!',
                'message' => 'Ocorreu um erro ao criar o post. Tente novamente.',
                'type'    => 'error',
            ]);
        }
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
        $data = $request->validated();

        try {
            $file = $request->file('banner_image');

            if ($file && $file->isValid()) {
                if ($post->banner_image) {
                    $this->uploadService->delete($post->banner_image);
                }

                $data['banner_image'] = $this->uploadService->upload($file, 'posts');
            } else {
                unset($data['banner_image']);
            }

            $this->postService->update($post, $data);

            return redirect()->route('admin.posts.index')->with('toast', [
                'title'   => 'Sucesso!',
                'message' => 'Post atualizado com sucesso.',
                'type'    => 'success',
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao atualizar post', ['error' => $e->getMessage(), 'post_id' => $post->id]);
            return redirect()->back()->withInput()->with('toast', [
                'title'   => 'Erro!',
                'message' => 'Ocorreu um erro ao atualizar o post. Tente novamente.',
                'type'    => 'error',
            ]);
        }
    }

    public function destroy(Post $post)
    {
        try {
            $this->postService->delete($post);

            return redirect()->route('admin.posts.index')->with('toast', [
                'title'   => 'Sucesso!',
                'message' => 'Post excluído com sucesso.',
                'type'    => 'success',
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao excluir post', ['error' => $e->getMessage(), 'post_id' => $post->id]);
            return redirect()->back()->with('toast', [
                'title'   => 'Erro!',
                'message' => 'Ocorreu um erro ao excluir o post. Tente novamente.',
                'type'    => 'error',
            ]);
        }
    }
}
