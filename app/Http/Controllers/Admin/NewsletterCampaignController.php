<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\SendNewsletterCampaign;
use App\Mail\NewsletterCampaignMail;
use App\Models\NewsletterCampaign;
use App\Models\NewsletterSubscriber;
use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;

class NewsletterCampaignController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/NewsletterCampaigns/Index', [
            'campaigns' => NewsletterCampaign::withCount('sendLogs')
                ->orderByDesc('created_at')
                ->paginate(20),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/NewsletterCampaigns/Form', [
            'posts' => Post::active()->orderByDesc('created_at')->get(['id', 'title']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title'        => ['required', 'string', 'max:200'],
            'subject'      => ['required', 'string', 'max:200'],
            'post_ids'     => ['required', 'array', 'min:1'],
            'post_ids.*'   => ['integer', 'exists:posts,id'],
            'scheduled_at' => ['nullable', 'date', 'after:now'],
        ]);

        $scheduledAt = $validated['scheduled_at'] ?? null;

        $campaign = NewsletterCampaign::create([
            'title'        => $validated['title'],
            'subject'      => $validated['subject'],
            'status'       => $scheduledAt ? 'scheduled' : 'draft',
            'scheduled_at' => $scheduledAt,
        ]);

        $campaign->posts()->sync($validated['post_ids']);

        return redirect()->route('admin.newsletter-campaigns.index')
            ->with('toast', ['title' => 'Sucesso!', 'message' => 'Campanha criada com sucesso.', 'type' => 'success']);
    }

    public function show(NewsletterCampaign $newsletterCampaign): Response
    {
        $newsletterCampaign->load('posts');

        return Inertia::render('Admin/NewsletterCampaigns/Show', [
            'campaign' => $newsletterCampaign,
            'logs'     => $newsletterCampaign->sendLogs()
                ->with('subscriber:id,name,email')
                ->orderByDesc('created_at')
                ->paginate(50),
            'stats'    => [
                'total'   => $newsletterCampaign->sendLogs()->count(),
                'sent'    => $newsletterCampaign->sendLogs()->where('status', 'sent')->count(),
                'failed'  => $newsletterCampaign->sendLogs()->where('status', 'failed')->count(),
                'pending' => $newsletterCampaign->sendLogs()->where('status', 'pending')->count(),
            ],
        ]);
    }

    public function preview(NewsletterCampaign $newsletterCampaign): HttpResponse
    {
        $newsletterCampaign->load('posts');

        $fakeMail = new NewsletterCampaignMail(
            $newsletterCampaign,
            new NewsletterSubscriber([
                'name'              => 'Fulano de Tal',
                'email'             => 'exemplo@exemplo.com',
                'unsubscribe_token' => 'preview-token',
            ])
        );

        return response($fakeMail->render(), 200, ['Content-Type' => 'text/html']);
    }

    public function send(NewsletterCampaign $newsletterCampaign): RedirectResponse
    {
        if (! $newsletterCampaign->isDraft() && ! $newsletterCampaign->isScheduled()) {
            return back()->with('toast', ['title' => 'Atenção', 'message' => 'Esta campanha não pode ser enviada.', 'type' => 'error']);
        }

        SendNewsletterCampaign::dispatch($newsletterCampaign);

        return back()->with('toast', ['title' => 'Enviando!', 'message' => 'Campanha enfileirada para envio.', 'type' => 'success']);
    }

    public function destroy(NewsletterCampaign $newsletterCampaign): RedirectResponse
    {
        if ($newsletterCampaign->status === 'sending') {
            return back()->with('toast', ['title' => 'Atenção', 'message' => 'Não é possível excluir uma campanha em envio.', 'type' => 'error']);
        }

        $newsletterCampaign->delete();

        return back()->with('toast', ['title' => 'Sucesso!', 'message' => 'Campanha excluída.', 'type' => 'success']);
    }
}
