<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VerifyPasswordRequest extends FormRequest
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
            'confirm_user_password' => ['required', 'string', 'min:8', 'max:64']
        ];
    }

    public function messages(): array
    {
        return [
            'confirm_user_password.required' => __('EditProfileValidationMessages.password_confirmation_required'),
            'confirm_user_password.min' => __('EditProfileValidationMessages.password_min_length'),
            'confirm_user_password.max' => __('EditProfileValidationMessages.password_max_length'),
            'confirm_user_password.string' => __('EditProfileValidationMessages.password_string'),
        ];
    }
}
