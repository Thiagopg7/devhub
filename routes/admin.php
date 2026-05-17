<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ConfigController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\PostController;
use App\Http\Controllers\Admin\ToggleController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'admin', 'as' => 'admin.', 'middleware' => ['auth', 'verified']], function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('/posts', PostController::class);
    Route::resource('/categories', CategoryController::class);
    Route::get('/configs', [ConfigController::class, 'edit'])->name('configs.edit');
    Route::put('/configs', [ConfigController::class, 'update'])->name('configs.update');

    Route::post('/toggle-active', [ToggleController::class, 'update'])
        ->name('toggle.active');
});
