<?php

namespace App\Http\Requests;

use App\Rules\Recaptcha;
use Illuminate\Foundation\Http\FormRequest;

class SignUpAsVendorRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'username' => ['required', 'unique:vendors,username', 'min:3', 'max:16'],
            'first_name' => ['required', 'min:3', 'max:20'],
            'last_name' => ['required', 'min:3', 'max:20'],
            'phone_number' => ['required', 'phone', 'unique:vendors,phone'],
            'country_code' => ['required', 'numeric', 'digits_between:1,3', 'required_with:phone_number'],
            'email' => ['email', 'unique:users,email', 'required'],
            'password' => ['required', 'min:8', 'max:64', 'confirmed'],
            'google_recaptcha' => ['required', 'string', new Recaptcha],
            'is_vendor' => ['required', 'boolean'],
        ];
    }
    public function messages(): array
    {
        return [
            'phone_number.required' => 'Please provide your phone number.',
            'phone_number.phone' => 'Please enter a valid phone number.',
            'phone_number.unique' => 'This phone number is already registered.',
            'country_code.digits_between' => 'The country code must be between 1 to 3 digits.',
        ];
    }
    protected function prepareForValidation()
    {
        if ($this->has('phone_number')) {
            $this->merge([
                'phone_number' => ltrim($this->input('phone_number'), '+'), // Remove existing '+' if any
            ]);

            $this->merge([
                'phone_number' => '+' . $this->input('phone_number'),
            ]);
        }
    }
}
