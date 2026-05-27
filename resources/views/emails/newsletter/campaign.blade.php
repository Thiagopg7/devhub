<x-mail::message>
# {{ $campaign->title }}

Olá! Confira as novidades que separamos para você esta semana.

---

@foreach ($posts as $post)
## [{{ $post->title }}]({{ url('/blog/' . $post->slug) }})

{{ $post->description }}

<x-mail::button :url="url('/blog/' . $post->slug)">
Ler artigo
</x-mail::button>

---

@endforeach

Até a próxima,<br>
**Equipe {{ config('app.name') }}**

<x-mail::subcopy>
Você está recebendo este e-mail porque se inscreveu na newsletter do {{ config('app.name') }}.
Caso não queira mais receber nossas novidades, [clique aqui para se descadastrar]({{ $unsubscribeUrl }}).
</x-mail::subcopy>
</x-mail::message>
