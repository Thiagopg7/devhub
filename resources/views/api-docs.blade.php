<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>DevHub API — Documentação</title>
    <link rel="stylesheet" href="{{ asset('vendor/swagger-ui/swagger-ui.css') }}" />
    <style>
        body { margin: 0; }
        .swagger-ui .topbar { background-color: #1e293b; }
        .swagger-ui .topbar .download-url-wrapper { display: none; }
    </style>
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="{{ asset('vendor/swagger-ui/swagger-ui-bundle.js') }}"></script>
    <script>
        SwaggerUIBundle({
            url: "{{ asset('docs/openapi.yaml') }}",
            dom_id: '#swagger-ui',
            presets: [SwaggerUIBundle.presets.apis],
            layout: 'BaseLayout',
            deepLinking: true,
            persistAuthorization: true,
        });
    </script>
</body>
</html>
