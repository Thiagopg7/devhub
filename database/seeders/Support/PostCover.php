<?php

namespace Database\Seeders\Support;

/**
 * Gera a capa de um post como SVG determinístico (cor da categoria + título).
 * Sem dependência de rede — funciona em qualquer ambiente, inclusive storage efêmero.
 */
class PostCover
{
    public static function svg(string $title, string $category, string $color): string
    {
        $color = preg_match('/^#[0-9A-Fa-f]{6}$/', $color) ? $color : '#3CBDF8';

        $lines = array_slice(self::wrap(trim($title), 24), 0, 4);

        $tspans = '';
        foreach ($lines as $i => $line) {
            $dy = $i === 0 ? 0 : 74;
            $tspans .= '<tspan x="80" dy="'.$dy.'">'.self::esc($line).'</tspan>';
        }

        $eyebrow = self::esc(mb_strtoupper($category, 'UTF-8'));

        return <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" font-family="'Segoe UI',system-ui,sans-serif">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0a1320"/>
      <stop offset="1" stop-color="#0f1d30"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.82" cy="0.18" r="0.9">
      <stop offset="0" stop-color="{$color}" stop-opacity="0.34"/>
      <stop offset="0.6" stop-color="{$color}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect x="0" y="0" width="10" height="630" fill="{$color}"/>
  <circle cx="980" cy="150" r="220" fill="none" stroke="{$color}" stroke-opacity="0.18" stroke-width="1.5"/>
  <circle cx="980" cy="150" r="150" fill="none" stroke="{$color}" stroke-opacity="0.12" stroke-width="1.5"/>
  <text x="80" y="150" fill="{$color}" font-size="26" font-weight="700" letter-spacing="3">{$eyebrow}</text>
  <text x="80" y="270" fill="#ffffff" font-size="60" font-weight="700" letter-spacing="-1">{$tspans}</text>
  <g transform="translate(80,560)" fill="#9fb3c8">
    <circle cx="11" cy="-8" r="11" fill="{$color}"/>
    <text x="34" y="0" font-size="26" font-weight="600" fill="#e8f0fa">DevHub</text>
  </g>
</svg>
SVG;
    }

    /** Quebra o texto em linhas de até $max caracteres, sem cortar palavras. */
    private static function wrap(string $text, int $max): array
    {
        $words = preg_split('/\s+/', $text);
        $lines = [];
        $current = '';

        foreach ($words as $word) {
            $candidate = $current === '' ? $word : $current.' '.$word;

            if (mb_strlen($candidate) > $max && $current !== '') {
                $lines[] = $current;
                $current = $word;
            } else {
                $current = $candidate;
            }
        }

        if ($current !== '') {
            $lines[] = $current;
        }

        return $lines;
    }

    private static function esc(string $value): string
    {
        return htmlspecialchars($value, ENT_QUOTES | ENT_XML1, 'UTF-8');
    }
}
