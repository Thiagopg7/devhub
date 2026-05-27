<?php

use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\BlockController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ConfigController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\GalleryImageController;
use App\Http\Controllers\Admin\ImageDeleteController;
use App\Http\Controllers\Admin\MenuController;
use App\Http\Controllers\Admin\NewsletterAreaController;
use App\Http\Controllers\Admin\NewsletterCampaignController;
use App\Http\Controllers\Admin\NewsletterSubscriberController;
use App\Http\Controllers\Admin\ReorderController;
use App\Http\Controllers\Admin\PageController;
use App\Http\Controllers\Admin\PostController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\TechnologyController;
use App\Http\Controllers\Admin\ToggleController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'admin', 'as' => 'admin.', 'middleware' => ['auth', 'verified', 'admin']], function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/posts/trashed', [PostController::class, 'trashed'])->name('posts.trashed')->middleware('can:posts.delete');
    Route::post('/posts/{id}/restore', [PostController::class, 'restore'])->name('posts.restore')->middleware('can:posts.delete');
    Route::delete('/posts/{id}/purge', [PostController::class, 'purge'])->name('posts.purge')->middleware('can:posts.delete');
    Route::resource('/posts', PostController::class)->middleware('resource.permission:posts');

    Route::get('/categories/trashed', [CategoryController::class, 'trashed'])->name('categories.trashed')->middleware('can:categories.delete');
    Route::post('/categories/{id}/restore', [CategoryController::class, 'restore'])->name('categories.restore')->middleware('can:categories.delete');
    Route::delete('/categories/{id}/purge', [CategoryController::class, 'purge'])->name('categories.purge')->middleware('can:categories.delete');
    Route::resource('/categories', CategoryController::class)->middleware('resource.permission:categories');
    Route::resource('/blocks', BlockController::class)->middleware('resource.permission:blocks');
    Route::resource('/technologies', TechnologyController::class)
        ->except(['show'])
        ->middleware('resource.permission:technologies');

    Route::get('/pages/trashed', [PageController::class, 'trashed'])->name('pages.trashed')->middleware('can:pages.delete');
    Route::post('/pages/{id}/restore', [PageController::class, 'restore'])->name('pages.restore')->middleware('can:pages.delete');
    Route::delete('/pages/{id}/purge', [PageController::class, 'purge'])->name('pages.purge')->middleware('can:pages.delete');
    Route::resource('/pages', PageController::class)
        ->except(['show'])
        ->middleware('resource.permission:pages');
    Route::post('/pages/{page}/gallery', [GalleryImageController::class, 'store'])
        ->name('pages.gallery.store')
        ->middleware('can:pages.edit');
    Route::delete('/gallery-images/{galleryImage}', [GalleryImageController::class, 'destroy'])
        ->name('gallery-images.destroy')
        ->middleware('can:pages.edit');

    Route::delete('/image', [ImageDeleteController::class, 'destroy'])->name('image.destroy');

    Route::get('/configs', [ConfigController::class, 'edit'])
        ->name('configs.edit')
        ->middleware('can:configs.view');
    Route::put('/configs', [ConfigController::class, 'update'])
        ->name('configs.update')
        ->middleware('can:configs.edit');

    Route::resource('/menu', MenuController::class)
        ->except(['show'])
        ->middleware('resource.permission:menu');

    Route::resource('/newsletter-areas', NewsletterAreaController::class)
        ->except(['show'])
        ->middleware('resource.permission:newsletter_areas');

    Route::resource('/newsletter-campaigns', NewsletterCampaignController::class)
        ->only(['index', 'create', 'store', 'show', 'destroy'])
        ->middleware('resource.permission:newsletter_campaigns');
    Route::post('/newsletter-campaigns/{newsletterCampaign}/send', [NewsletterCampaignController::class, 'send'])
        ->name('newsletter-campaigns.send')
        ->middleware('can:newsletter_campaigns.edit');
    Route::get('/newsletter-campaigns/{newsletterCampaign}/preview', [NewsletterCampaignController::class, 'preview'])
        ->name('newsletter-campaigns.preview')
        ->middleware('can:newsletter_campaigns.view');

    Route::get('/newsletter-subscribers', [NewsletterSubscriberController::class, 'index'])
        ->name('newsletter-subscribers.index')
        ->middleware('can:newsletter_subscribers.view');
    Route::delete('/newsletter-subscribers/{newsletterSubscriber}', [NewsletterSubscriberController::class, 'destroy'])
        ->name('newsletter-subscribers.destroy')
        ->middleware('can:newsletter_subscribers.delete');

    Route::resource('/roles', RoleController::class)
        ->except(['show'])
        ->middleware('resource.permission:roles');

    Route::resource('/users', UserController::class)
        ->except(['show'])
        ->middleware('resource.permission:users');

    Route::get('/activity-log', [ActivityLogController::class, 'index'])
        ->name('activity-log.index')
        ->middleware('can:activity_log.view');


    Route::post('/toggle-active', [ToggleController::class, 'update'])->name('toggle.active')->middleware('can:posts.edit');
    Route::post('/reorder', [ReorderController::class, 'update'])->name('reorder')->middleware('can:menu.edit');
});
