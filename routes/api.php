<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\PageController;
use App\Http\Controllers\Api\PostController;
use App\Http\Middleware\ValidateApiToken;
use Illuminate\Support\Facades\Route;

Route::middleware(ValidateApiToken::class)->group(function () {
    Route::get('/posts',           [PostController::class, 'index']);
    Route::get('/posts/{slug}',    [PostController::class, 'show']);
    Route::get('/categories',      [CategoryController::class, 'index']);
    Route::get('/pages/{slug}',    [PageController::class, 'show']);
    Route::get('/menu',            [MenuController::class, 'index']);
});
