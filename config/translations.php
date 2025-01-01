<?php

return [
    'static' => [
        'home' => 'home',
        'categories' => 'categories',
        'users' => 'users',
        // Add other static namespaces here
    ],
    'dynamic' => [
        'category' => 'category_{slug}', // dynamic category slug namespace
        'user' => 'user_{id}', // dynamic user namespace
        // Add other dynamic routes here
    ],
];
