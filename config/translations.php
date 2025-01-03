<?php

return [
    'static' => [
        'home' => 'home',
        'categories' => 'categories',
        'users' => 'users',
        'showBook' => 'showBook',
        // Add other static namespaces here
    ],
    'dynamic' => [
        'category' => 'category_{slug}', // dynamic category slug namespace
        'user' => 'user_{id}', // dynamic user namespace
        'book' => 'book_{slug}',
        // Add other dynamic routes here
    ],
];
