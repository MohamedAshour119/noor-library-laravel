<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

$this->app->booted(function () {
    $schedule = $this->app->make(\Illuminate\Console\Scheduling\Schedule::class);

    $schedule->call(function () {
        DB::table('personal_access_tokens')
            ->whereJsonContains('abilities', 'profile-update') // Matches specific ability
            ->where('created_at', '<=', now()->subMinutes(15)) // Older than 15 minutes
            ->delete();
    })->everyMinute(); // Executes every minute

    $schedule->call(function () {
        DB::table('personal_access_tokens')
            ->where('created_at', '<=', now()->subHours(24))
            ->delete();
    })->hourly();
});
