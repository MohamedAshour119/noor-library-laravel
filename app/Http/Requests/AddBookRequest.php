<?php

namespace App\Http\Requests;

use App\Rules\ValidateBookPrice;
use App\Traits\HttpResponses;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Log;

class AddBookRequest extends FormRequest
{
    use HttpResponses;
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
            'price' => $this->price === 'null' ? null : $this->price,
            'downloadable' => match ($this->input('downloadable')) {
                'true' => true,
                'false' => false,
                default => $this->input('downloadable'),
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
            'price' => [new ValidateBookPrice($this->input('is_free'))],
            'language' => ['min:2', 'max:2'],
            'author' => ['required', 'max:80'],
            'category' => ['required'],
            'downloadable' => ['boolean'],
            'cover' => ['image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
            'book_file' => ['file', 'mimes:pdf', 'max:81920'],
        ];
    }
    public function messages(): array
    {
        return [
            'title.required' => __('AddBookValidationMessages.required', ['attribute' => __('AddBookValidationMessages.title_attribute')]),
            'title.min' => __('AddBookValidationMessages.min.string', ['attribute' => __('AddBookValidationMessages.title_attribute'), 'min' => 3]),
            'title.max' => __('AddBookValidationMessages.max.string', ['attribute' => __('AddBookValidationMessages.title_attribute'), 'max' => 64]),
            'title.unique' => __('AddBookValidationMessages.unique', ['attribute' => __('AddBookValidationMessages.title_attribute')]),

            'description.required' => __('AddBookValidationMessages.required', ['attribute' => __('AddBookValidationMessages.description_attribute')]),
            'description.min' => __('AddBookValidationMessages.min.string', ['attribute' => __('AddBookValidationMessages.description_attribute'), 'min' => 50]),
            'description.max' => __('AddBookValidationMessages.max.string', ['attribute' => __('AddBookValidationMessages.description_attribute'), 'max' => 2000]),

            'is_author.required' => __('AddBookValidationMessages.required', ['attribute' => __('AddBookValidationMessages.is_author_attribute')]),
            'is_author.boolean' => __('AddBookValidationMessages.boolean', ['attribute' => __('AddBookValidationMessages.is_author_attribute')]),
            'is_author.present' => __('AddBookValidationMessages.present', ['attribute' => __('AddBookValidationMessages.is_author_attribute')]),

            'is_free.required' => __('AddBookValidationMessages.required', ['attribute' => __('AddBookValidationMessages.is_free_attribute')]),
            'is_free.boolean' => __('AddBookValidationMessages.boolean', ['attribute' => __('AddBookValidationMessages.is_free_attribute')]),
            'is_free.present' => __('AddBookValidationMessages.present', ['attribute' => __('AddBookValidationMessages.is_free_attribute')]),

            'price.required' => __('AddBookValidationMessages.required', ['attribute' => __('AddBookValidationMessages.price_attribute')]),

            'language.min' => __('AddBookValidationMessages.min.string', ['attribute' => __('AddBookValidationMessages.language_attribute'), 'min' => 2]),
            'language.max' => __('AddBookValidationMessages.max.string', ['attribute' => __('AddBookValidationMessages.language_attribute'), 'max' => 2]),

            'author.required' => __('AddBookValidationMessages.required', ['attribute' => __('AddBookValidationMessages.author_attribute')]),
            'author.max' => __('AddBookValidationMessages.max.string', ['attribute' => __('AddBookValidationMessages.author_attribute'), 'max' => 80]),

            'category.required' => __('AddBookValidationMessages.required', ['attribute' => __('AddBookValidationMessages.category_attribute')]),

            'downloadable.boolean' => __('AddBookValidationMessages.boolean', ['attribute' => __('AddBookValidationMessages.downloadable_attribute')]),

            'cover.image' => __('AddBookValidationMessages.image', ['attribute' => __('AddBookValidationMessages.cover_attribute')]),
            'cover.mimes' => __('AddBookValidationMessages.mimes', ['attribute' => __('AddBookValidationMessages.cover_attribute'), 'values' => 'jpeg, jpg, png, webp']),
            'cover.max' => __('AddBookValidationMessages.max.file', ['attribute' => __('AddBookValidationMessages.cover_attribute'), 'max' => 5120]),

            'book_file.file' => __('AddBookValidationMessages.file', ['attribute' => __('AddBookValidationMessages.book_file_attribute')]),
            'book_file.mimes' => __('AddBookValidationMessages.mimes', ['attribute' => __('AddBookValidationMessages.book_file_attribute'), 'values' => 'pdf']),
            'book_file.max' => __('AddBookValidationMessages.max.file', ['attribute' => __('AddBookValidationMessages.book_file_attribute'), 'max' => 81920]),
        ];
    }

    public function attributes(): array
    {
        return [
            'title' => __('AddBookValidationMessages.title_attribute'),
            'description' => __('AddBookValidationMessages.description_attribute'),
            'is_author' => __('AddBookValidationMessages.is_author_attribute'),
            'is_free' => __('AddBookValidationMessages.is_free_attribute'),
            'price' => __('AddBookValidationMessages.price_attribute'),
            'language' => __('AddBookValidationMessages.language_attribute'),
            'author' => __('AddBookValidationMessages.author_attribute'),
            'category' => __('AddBookValidationMessages.category_attribute'),
            'downloadable' => __('AddBookValidationMessages.downloadable_attribute'),
            'cover' => __('AddBookValidationMessages.cover_attribute'),
            'book_file' => __('AddBookValidationMessages.book_file_attribute'),
        ];
    }
    protected function failedValidation(Validator $validator)
    {
        // Get the failed rules and their error messages
        $failedRules = $validator->failed();
        $errors = $validator->errors()->messages();

        $firstErrors = [];

        foreach ($errors as $field => $messages) {
            if ($field === 'is_free') {
                $firstErrors[$field] = __('AddBookValidationMessages.is_free_attribute');
            } elseif ($field === 'category') {
                $firstErrors[$field] = __('AddBookValidationMessages.category_attribute');
            } elseif ($field === 'author') {
                if (isset($failedRules['author']['Required'])) {
                    $firstErrors[$field] = __('AddBookValidationMessages.author_attribute_required');
                } elseif (isset($failedRules['author']['Max'])) {
                    $firstErrors[$field] = __('AddBookValidationMessages.author_attribute_max');
                } else {
                    $firstErrors[$field] = $messages[0]; // Fallback for other errors
                }
            } elseif ($field === 'language') {
                if (isset($failedRules['language']['Min'])) {
                    $firstErrors[$field] = __('AddBookValidationMessages.language_attribute_min');
                } elseif (isset($failedRules['author']['Max'])) {
                    $firstErrors[$field] = __('AddBookValidationMessages.language_attribute_max');
                } else {
                    $firstErrors[$field] = $messages[0]; // Fallback for other errors
                }
            } else {
                $firstErrors[$field] = $messages[0];
            }
        }

        throw new HttpResponseException(
            $this->response_error('Validation failed', $firstErrors, 422)
        );
    }


}
