<?php

use App\Http\Controllers\Api\PostController;
use App\Http\Middleware\ValidateApiToken;
use Illuminate\Support\Facades\Route;

Route::middleware(ValidateApiToken::class)->group(function () {
    Route::get('/posts',        [PostController::class, 'index']);
    Route::get('/posts/{slug}', [PostController::class, 'show']);
});
