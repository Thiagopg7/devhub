<?php

use App\Http\Controllers\Admin\PostController;
use Illuminate\Support\Facades\Route;


Route::group(['prefix' => 'admin', 'as' => 'admin.'], function () {
    
    Route::middleware(['auth'])->group(function () {
        Route::resource('/admin/posts', PostController::class);
    });

});
