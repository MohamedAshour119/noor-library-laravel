<!doctype html>

<html
    lang="{{ app()->getLocale() }}"
    dir="{{ app()->getLocale() === 'ar' ? 'rtl' : 'ltr' }}"
>

<head>
    <meta charset="UTF-8"/>
    <link rel="canonical" href="{{ url()->current() }}">
    <meta name="csrf_token" content="{{ session()->get('token') !== null? base64_decode(session()->get('token')) : csrf_token() }}"/>
    <link rel="icon" type="image/svg+xml" href="/nav-logo.svg"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>{{ config('app.name') }}</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400..700&family=Tajawal:wght@200;300;400;500;700;800;900&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400..700&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Tajawal:wght@200;300;400;500;700;800;900&display=swap" rel="stylesheet">
    @viteReactRefresh
    @vite('resources/frontend/src/main.tsx')

</head>
<body>
{{--    <div id="root" class="flex flex-col h-full min-h-svh"></div>--}}
    <div id="root" class="h-full text-text_color"></div>
</body>
</html>
