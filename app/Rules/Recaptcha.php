<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class Recaptcha implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $google_response = (string) $value;

        Log::info('token', [$google_response]);

        $response = Http::asForm()->post(
            'https://www.google.com/recaptcha/api/siteverify',
                ['secret' => env('RECAPTCHA_SECRET_KEY'), 'response' => $google_response]
        );

        if (!json_decode($response->body(), true)['success']) {
            $fail('Invalid recaptcha');
        }
    }
}
