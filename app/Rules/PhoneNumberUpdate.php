<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PhoneNumberUpdate implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // Get the current authenticated user
        $user = Auth::user();

        // Check if the phone number exists in 'users' table but belongs to a different user
        $existsInUsers = DB::table('users')
            ->where('phone', $value)
            ->where('id', '!=', $user->id)
            ->exists();

        // Check if the phone number exists in 'vendors' table
        $existsInVendors = DB::table('vendors')
            ->where('phone', $value)
            ->where('id', '!=', $user->id)
            ->exists();

        // If the phone number exists in either table, fail validation
        if ($existsInUsers || $existsInVendors) {
            $fail(__('The phone number is already in use.'));
        }
    }
}
