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
        $data = $request->validate([
            'title' => 'required|max:255',
            'content' => 'required',
        ]);

        Post::create($data);

        return redirect()->route('posts.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        //
    }
}
