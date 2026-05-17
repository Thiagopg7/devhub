<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ConfigController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\GalleryImageController;
use App\Http\Controllers\Admin\ImageDeleteController;
use App\Http\Controllers\Admin\MenuController;
use App\Http\Controllers\Admin\ReorderController;
use App\Http\Controllers\Admin\PageController;
use App\Http\Controllers\Admin\PostController;
use App\Http\Controllers\Admin\TechnologyController;
use App\Http\Controllers\Admin\ToggleController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'admin', 'as' => 'admin.', 'middleware' => ['auth', 'verified']], function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('/posts', PostController::class);
    Route::resource('/categories', CategoryController::class);
    Route::resource('/technologies', TechnologyController::class)->except(['show']);

    Route::resource('/pages', PageController::class)->except(['show']);
    Route::post('/pages/{page}/gallery', [GalleryImageController::class, 'store'])->name('pages.gallery.store');
    Route::delete('/gallery-images/{galleryImage}', [GalleryImageController::class, 'destroy'])->name('gallery-images.destroy');

    Route::delete('/image', [ImageDeleteController::class, 'destroy'])->name('image.destroy');

    Route::get('/configs', [ConfigController::class, 'edit'])->name('configs.edit');
    Route::put('/configs', [ConfigController::class, 'update'])->name('configs.update');

    Route::resource('/menu', MenuController::class)->except(['show']);

    Route::post('/toggle-active', [ToggleController::class, 'update'])->name('toggle.active');
    Route::post('/reorder', [ReorderController::class, 'update'])->name('reorder');
});
