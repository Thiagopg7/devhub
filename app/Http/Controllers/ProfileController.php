<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Services\FileUploadService;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request, FileUploadService $uploadService): RedirectResponse
    {
        $user = $request->user();
        $data = $request->validated();
        $oldAvatar = $user->avatar_image;

        if ($request->hasFile('avatar_image')) {
            $data['avatar_image'] = $uploadService->upload($request->file('avatar_image'), 'avatars');
        } else {
            unset($data['avatar_image']);
        }

        $user->fill($data);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        if (isset($data['avatar_image']) && $oldAvatar) {
            $uploadService->delete($oldAvatar);
        }

        return Redirect::route('profile.edit')
            ->with('toast', ['title' => 'Sucesso!', 'message' => 'Perfil atualizado com sucesso.', 'type' => 'success']);
    }

    /**
     * Remove the user's avatar.
     */
    public function destroyAvatar(Request $request, FileUploadService $uploadService): RedirectResponse
    {
        $user = $request->user();

        if ($user->avatar_image) {
            $uploadService->delete($user->avatar_image);
            $user->update(['avatar_image' => null]);
        }

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
