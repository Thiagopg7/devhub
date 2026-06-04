<?php

namespace Database\Seeders;

use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        $testimonials = [
            [
                'name' => 'Mariana Lopes',
                'role' => 'Desenvolvedora Full-Stack',
                'company' => 'Finova',
                'content' => 'Os artigos do DevHub viraram leitura obrigatória no meu dia a dia. A profundidade técnica sem perder a clareza é algo raro de encontrar.',
            ],
            [
                'name' => 'Rafael Andrade',
                'role' => 'Tech Lead',
                'company' => 'QuickFood',
                'content' => 'Indico o DevHub para todo o meu time. O conteúdo sobre arquitetura e boas práticas tem nível de quem realmente coloca a mão na massa.',
            ],
            [
                'name' => 'Camila Ferreira',
                'role' => 'Engenheira de Software',
                'company' => 'Pagora',
                'content' => 'Acompanho o DevHub há meses e cada post me ensina algo novo. É um dos poucos blogs em português que mantém a qualidade lá em cima.',
            ],
            [
                'name' => 'Bruno Carvalho',
                'role' => 'Desenvolvedor Backend',
                'company' => null,
                'content' => 'Conteúdo direto ao ponto, sem enrolação. Os tutoriais de Laravel me ajudaram a subir de nível na carreira.',
            ],
            [
                'name' => 'Juliana Martins',
                'role' => 'Product Engineer',
                'company' => 'Habita',
                'content' => 'O que mais gosto no DevHub é a curadoria. Os temas são atuais e sempre alinhados com o que o mercado está pedindo de verdade.',
            ],
            [
                'name' => 'Diego Souza',
                'role' => 'DevOps Engineer',
                'company' => 'ShopMax',
                'content' => 'Material de altíssimo nível. A seção de tecnologias e a agenda de eventos me mantêm sempre por dentro do ecossistema.',
            ],
        ];

        foreach ($testimonials as $order => $data) {
            Testimonial::create([
                ...$data,
                'order' => $order + 1,
                'is_active' => true,
            ]);
        }
    }
}
