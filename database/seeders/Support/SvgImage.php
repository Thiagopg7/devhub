<?php

namespace Database\Seeders\Support;

/**
 * Gera imagens SVG determinísticas para seeds (logos e painéis).
 * Offline e reproduzível — substitui downloads de imagem que não sobrevivem a storage efêmero.
 */
class SvgImage
{
    /** Logo quadrado estilo "app icon" com as iniciais do rótulo. */
    public static function logo(string $label, string $color): string
    {
        $color = self::color($color);
        $initials = self::esc(self::initials($label));

        return <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400" font-family="'Segoe UI',system-ui,sans-serif">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="{$color}"/>
      <stop offset="1" stop-color="{$color}" stop-opacity="0.65"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" rx="88" fill="{$color}" fill-opacity="0.12"/>
  <rect x="40" y="40" width="320" height="320" rx="72" fill="url(#g)"/>
  <text x="200" y="200" fill="#ffffff" font-size="150" font-weight="700" text-anchor="middle" dominant-baseline="central">{$initials}</text>
</svg>
SVG;
    }

    /** Painel largo (estilo janela) com título e subtítulo — para screenshots e imagens de página. */
    public static function wide(string $title, string $subtitle, string $color, int $width = 1200, int $height = 750): string
    {
        $color = self::color($color);
        $title = self::esc($title);
        $subtitle = self::esc($subtitle);

        return <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {$width} {$height}" width="{$width}" height="{$height}" font-family="'Segoe UI',system-ui,sans-serif">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0a1320"/>
      <stop offset="1" stop-color="#0f1d30"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.35" r="0.75">
      <stop offset="0" stop-color="{$color}" stop-opacity="0.38"/>
      <stop offset="0.7" stop-color="{$color}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="{$width}" height="{$height}" fill="url(#bg)"/>
  <rect width="{$width}" height="{$height}" fill="url(#glow)"/>
  <circle cx="56" cy="48" r="9" fill="#ff5f57"/>
  <circle cx="86" cy="48" r="9" fill="#febc2e"/>
  <circle cx="116" cy="48" r="9" fill="#28c840"/>
  <line x1="0" y1="86" x2="{$width}" y2="86" stroke="{$color}" stroke-opacity="0.2"/>
  <text x="50%" y="48%" fill="#ffffff" font-size="68" font-weight="700" text-anchor="middle" letter-spacing="-1">{$title}</text>
  <text x="50%" y="48%" dy="60" fill="{$color}" font-size="30" font-weight="500" text-anchor="middle">{$subtitle}</text>
</svg>
SVG;
    }

    /** Extrai até duas iniciais do rótulo (ex.: "GitHub Copilot" → "GC", "Figma" → "FI"). */
    private static function initials(string $label): string
    {
        $words = array_values(array_filter(preg_split('/\s+/', trim($label))));

        if (count($words) >= 2) {
            return mb_strtoupper(mb_substr($words[0], 0, 1).mb_substr($words[1], 0, 1), 'UTF-8');
        }

        return mb_strtoupper(mb_substr($words[0] ?? '?', 0, 2), 'UTF-8');
    }

    private static function color(string $color): string
    {
        return preg_match('/^#[0-9A-Fa-f]{6}$/', $color) ? $color : '#3CBDF8';
    }

    private static function esc(string $value): string
    {
        return htmlspecialchars($value, ENT_QUOTES | ENT_XML1, 'UTF-8');
    }
}
