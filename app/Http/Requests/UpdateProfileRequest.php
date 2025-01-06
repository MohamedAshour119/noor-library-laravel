<?php

namespace App\Http\Requests;

use App\Rules\PhoneNumberUpdate;
use App\Rules\Recaptcha;
use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
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
            'first_name' => ['required', 'min:3', 'max:20'],
            'last_name' => ['required', 'min:3', 'max:20'],
            'phone_number' => ['required', 'phone', new PhoneNumberUpdate],
            'country_code' => ['required', 'numeric', 'digits_between:1,3', 'required_with:phone_number'],
            'email' => ['required', 'email', 'unique:users,email', 'required'],
            'password' => ['nullable', 'min:8', 'max:64', 'confirmed'],
        ];
    }
    public function messages(): array
    {
        return [
            'first_name.required' => __('EditProfileValidationMessages.first_name_required'),
            'first_name.min' => __('EditProfileValidationMessages.first_name_min'),
            'first_name.max' => __('EditProfileValidationMessages.first_name_max'),

            'last_name.required' => __('EditProfileValidationMessages.last_name_required'),
            'last_name.min' => __('EditProfileValidationMessages.last_name_min'),
            'last_name.max' => __('EditProfileValidationMessages.last_name_max'),

            'phone_number.required' => __('EditProfileValidationMessages.phone_number_required'),
            'phone_number.phone' => __('EditProfileValidationMessages.phone_number_phone'),
            'phone_number.unique' => __('EditProfileValidationMessages.phone_number_unique'),

            'country_code.required' => __('EditProfileValidationMessages.country_code_required'),
            'country_code.numeric' => __('EditProfileValidationMessages.country_code_numeric'),
            'country_code.digits_between' => __('EditProfileValidationMessages.country_code_digits_between'),
            'country_code.required_with' => __('EditProfileValidationMessages.country_code_required_with'),

            'email.required' => __('EditProfileValidationMessages.email_required'),
            'email.email' => __('EditProfileValidationMessages.email_email'),
            'email.unique' => __('EditProfileValidationMessages.email_unique'),

            'password.min' => __('EditProfileValidationMessages.password_min'),
            'password.max' => __('EditProfileValidationMessages.password_max'),
            'password.confirmed' => __('EditProfileValidationMessages.password_confirmed'),
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
