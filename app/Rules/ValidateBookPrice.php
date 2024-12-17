<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class ValidateBookPrice implements Rule
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
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        $this->value = $value;  // Store value here

        // If is_free is true, ensure price is null
        if ($this->is_free === true && !is_null($value)) {
            return false;
        }

        // If is_free is false, ensure price is not null
        if ($this->is_free === false && is_null($value)) {
            return false;
        }

        // If price is not null, validate numeric value and apply other rules
        if (!is_null($value)) {
            // Ensure price is numeric
            if (!is_numeric($value)) {
                return false;
            }

            // Ensure price is greater than or equal to 0
            if ($value < 0) {
                return false;
            }

            // Ensure price is at least 10
            if ($value < 10) {
                return false;
            }
        }

        return true;
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
            return 'The price field must be null when the is_free field is true.';
        }

        // If is_free is false and price is null, ensure price is not null
        if ($this->is_free === false && is_null($this->value)) {
            return 'The price field is required.';
        }

        // General validation message for price being below 10
        return 'The price field must be greater than or equal to 10.';
    }
}
