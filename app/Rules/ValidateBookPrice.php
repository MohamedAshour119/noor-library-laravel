<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidateBookPrice implements ValidationRule
{
    /**
     * The `is_free` value.
     *
     * @var mixed
     */
    protected $is_free;
    protected $value;  // Store value for later access

    /**
     * Create a new rule instance.
     *
     * @param  mixed  $is_free
     * @return void
     */
    public function __construct($is_free)
    {
        $this->is_free = $is_free;
    }


    /**
     * Get the error message for the validation rule.
     *
     * @return string
     */
    public function message()
    {
        // If is_free is true, ensure price is null
        if ($this->is_free === true) {
            return __('AddBookValidationMessages.price_attribute_null');
//            return 'The price field must be null when the is_free field is true.';
        }

        // If is_free is false and price is null, ensure price is not null
        if ($this->is_free === false && is_null($this->value)) {
            return __('AddBookValidationMessages.price_attribute_required');
        }

        // General validation message for price being below 10
        return __('AddBookValidationMessages.price_attribute_min');
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // Store value for later access
        $this->value = $value;

        // If is_free is true, ensure price is null
        if ($this->is_free === true && !is_null($value)) {
            $fail(__('AddBookValidationMessages.price_attribute_null'));
            return;
        }

        // If is_free is false, ensure price is not null
        if ($this->is_free === false && is_null($value)) {
            $fail(__('AddBookValidationMessages.price_attribute_required'));
            return;
        }

        // If price is not null, validate numeric value and apply other rules
        if (!is_null($value)) {
            // Ensure price is numeric
            if (!is_numeric($value)) {
                $fail(__('AddBookValidationMessages.price_attribute_numeric'));
                return;
            }

            // Ensure price is at least 10
            if ($value < 10) {
                $fail(__('AddBookValidationMessages.price_min'));
                return;
            }

            // Ensure price is less than 10000
            if ($value > 10000) {
                $fail(__('AddBookValidationMessages.price_max'));
                return;
            }
        }
    }
}
