<?php

use App\Http\Controllers\AgendaController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\SobreController;
use App\Http\Controllers\TechnologyController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');
Route::get('/blog/categoria/{slug}', [BlogController::class, 'byCategory'])->name('blog.category');
Route::get('/blog/{slug}', [BlogController::class, 'show'])->name('blog.show');
Route::get('/tecnologias', [TechnologyController::class, 'index'])->name('technologies.index');
Route::get('/sobre', [SobreController::class, 'index'])->name('sobre');
Route::get('/agenda', [AgendaController::class, 'index'])->name('agenda');
Route::get('/pages/{slug}', [PageController::class, 'show'])->name('pages.show');
Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');

Route::post('/newsletter/subscribe', [NewsletterController::class, 'store'])
    ->name('newsletter.subscribe')
    ->middleware('throttle:5,60');

Route::get('/newsletter/unsubscribe/{token}', [NewsletterController::class, 'unsubscribe'])
    ->name('newsletter.unsubscribe');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile/avatar', [ProfileController::class, 'destroyAvatar'])->name('profile.avatar.destroy');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/api/docs', fn () => view('api-docs'))->name('api.docs');

require __DIR__.'/auth.php';
