<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\PostController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::group(['prefix' => 'admin', 'as' => 'admin.', 'middleware' => ['auth', 'verified']], function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('/posts', PostController::class);
});
