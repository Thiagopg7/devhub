<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Config;
use App\Services\ConfigService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ConfigController extends Controller
{
    public function __construct(private readonly ConfigService $configService) {}

    public function index(Request $request): Response
    {
        return Inertia::render('Admin/Configs/Index', [
            'configs' => $this->configService->getPaginated(20, $request->q),
            'filter'  => ['q' => $request->q],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Configs/Form');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'key'   => ['required', 'string', 'regex:/^[a-z0-9_]+$/', 'unique:configs,key', 'max:100'],
            'group' => ['required', 'string', 'max:50'],
            'value' => ['nullable', 'string'],
        ], [
            'key.regex'  => 'A chave deve conter apenas letras minúsculas, números e underscore.',
            'key.unique' => 'Essa chave já existe.',
        ]);

        $this->configService->create(
            $validated['key'],
            $this->configService->parseValue($validated['value'] ?? ''),
            $validated['group'],
        );

        return redirect()->route('admin.configs.index')
            ->with('success', 'Configuração criada com sucesso.');
    }

    public function edit(Config $config): Response
    {
        return Inertia::render('Admin/Configs/Form', [
            'config' => [
                'key'   => $config->key,
                'group' => $config->group,
                'value' => $this->configService->formatValue($config->value),
            ],
        ]);
    }

    public function update(Request $request, Config $config): RedirectResponse
    {
        $validated = $request->validate([
            'group' => ['required', 'string', 'max:50'],
            'value' => ['nullable', 'string'],
        ]);

        $this->configService->update(
            $config,
            $this->configService->parseValue($validated['value'] ?? ''),
            $validated['group'],
        );

        return redirect()->route('admin.configs.index')
            ->with('success', 'Configuração atualizada com sucesso.');
    }

    public function destroy(Config $config): RedirectResponse
    {
        $this->configService->delete($config);

        return redirect()->route('admin.configs.index')
            ->with('success', 'Configuração excluída.');
    }
}
