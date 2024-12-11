<?php

namespace App\Http\Requests;

use App\Rules\Recaptcha;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;

class SignUpRequest extends FormRequest
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
        Log::info('Request Data', [$this->request->all()]);
        return [
            'username' => ['required', 'unique:users,username', 'min:3', 'max:16'],
            'email' => ['email', 'unique:users,email', 'required'],
            'password' => ['required', 'min:8', 'max:64', 'confirmed'],
            'google_recaptcha' => ['required', 'string', new Recaptcha],
        ];
    }
}
