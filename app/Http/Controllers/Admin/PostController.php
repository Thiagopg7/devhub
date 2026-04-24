<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\PostRequest;
use App\Services\FileUploadService;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    public function __construct(
        private FileUploadService $uploadService
    ) {}

    public function index(Request $request)
    {
        $query = Post::orderBy('id', 'ASC');

        if ($request->filled('q')) {
            $search = $request->input('q');

            $query->where(function ($q) use ($search) {
                $q->when(is_numeric($search), function ($q) use ($search) {
                    $q->where('id', $search);
                })
                    ->orWhere('name', 'like', "%{$search}%");
            });
        }

        return Inertia::render('Admin/Posts/Index', [
            'posts' => $query->paginate(20),
            'filter' => $request->only('q'),
            'toast' => session('toast'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Posts/Form', [
            'toast' => session('toast'),
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

            Post::create($data);

            return redirect()->route('admin.posts.index')->with('toast', [
                'title' => 'Sucesso!',
                'message' => 'Post criado com sucesso.',
                'type' => 'success',
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with('toast', [
                'title' => 'Erro!',
                'message' => 'Erro ao criar post: ' . $e->getMessage(),
                'type' => 'error',
            ]);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post)
    {
        return Inertia::render('Admin/Posts/Form', [
            'post' => $post,
            'toast' => session('toast'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PostRequest $request, Post $post)
    {
        $data = $request->validated();

        try {
            $file = $request->file('banner_image');

            if ($file && $file->isValid()) {
                if ($post->banner_image) {
                    $this->uploadService->delete($post->banner_image);
                }

                $data['banner_image'] = $this->uploadService->upload(
                    $file,
                    'posts'
                );
            } else {
                unset($data['banner_image']);
            }

            $post->update($data);

            return redirect()->route('admin.posts.index')->with('toast', [
                'title' => 'Sucesso!',
                'message' => 'Post atualizado com sucesso.',
                'type' => 'success',
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with('toast', [
                'title' => 'Erro!',
                'message' => 'Erro ao atualizar Post: ' . $e->getMessage(),
                'type' => 'error',
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        try {
            $post->delete();

            return redirect()->route('admin.posts.index')->with('toast', [
                'title' => 'Sucesso!',
                'message' => 'Post excluído com sucesso.',
                'type' => 'success',
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('toast', [
                'title' => 'Erro!',
                'message' => 'Erro ao excluir Post: ' . $e->getMessage(),
                'type' => 'error',
            ]);
        }
    }
}
