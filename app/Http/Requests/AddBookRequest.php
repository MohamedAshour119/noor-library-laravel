<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddBookRequest extends FormRequest
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

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_author' => match ($this->input('is_author')) {
                'true' => true,
                'false' => false,
                'null' => null,
                default => $this->input('is_author'),
            },
            'is_free' => match ($this->input('is_free')) {
                'true' => true,
                'false' => false,
                'null' => null,
                default => $this->input('is_free'),
            },
        ]);
    }


    public function rules(): array
    {
        return [
            'title' => ['required', 'min:3', 'max:64', 'unique:books,title'],
            'description' => ['required', 'min:50', 'max:2000'],
            'is_author' => ['required', 'boolean', 'present'],
            'is_free' => ['required', 'boolean', 'present'],
            'language' => ['min:2', 'max:2'],
            'author' => ['required', 'max:80'],
            'category' => ['required'],
            'downloadable' => ['boolean'],
            'cover' => ['image', 'mimes:jpj,jpeg,png,webp', 'max:5120'],
            'book_file' => ['file', 'mimes:pdf', 'max:81920'],
        ];
    }
}
