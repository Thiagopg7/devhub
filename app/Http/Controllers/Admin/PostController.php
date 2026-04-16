<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
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

    public function store(Request $request)
    {
        try {
            $data = $request->validate($this->rules($request));

            if ($request->hasFile('banner_image')) {
                $data['banner_image'] = $request->file('banner_image')->store('posts', 'public');
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
    public function update(Request $request, Post $post)
    {
        try {
            $data = $request->validate($this->rules($request));

            if ($request->hasFile('banner_image') && $request->file('banner_image')->isValid()) {
                $data['banner_image'] = $request->file('banner_image')->store('posts', 'public');
            } else {
                $data['banner_image'] = $post->banner_image;
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

    private function rules()
    {
        return [
            'title'             => 'required|string|max:150',
            'description'       => 'required|string|max:255',
            'content'           => 'nullable|string',
            'banner_image'      => 'nullable|image|mimes:jpg,jpeg,png,webp,svg|max:8192',
            'is_active'         => 'boolean',
            'meta_title'        => 'nullable|string|max:150',
            'meta_description'  => 'nullable|string|max:255',
        ];
    }
}
