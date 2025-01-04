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
            'title.required' => __('AddBookValidationMessages.required', ['attribute' => __('AddBookValidationMessages.attributes.title')]),
            'title.min' => __('AddBookValidationMessages.min.string', ['attribute' => __('AddBookValidationMessages.attributes.title'), 'min' => 3]),
            'title.max' => __('AddBookValidationMessages.max.string', ['attribute' => __('AddBookValidationMessages.attributes.title'), 'max' => 64]),
            'title.unique' => __('AddBookValidationMessages.unique', ['attribute' => __('AddBookValidationMessages.attributes.title')]),

            'description.required' => __('AddBookValidationMessages.required', ['attribute' => __('AddBookValidationMessages.attributes.description')]),
            'description.min' => __('AddBookValidationMessages.min.string', ['attribute' => __('AddBookValidationMessages.attributes.description'), 'min' => 50]),
            'description.max' => __('AddBookValidationMessages.max.string', ['attribute' => __('AddBookValidationMessages.attributes.description'), 'max' => 2000]),

            'is_author.required' => __('AddBookValidationMessages.required', ['attribute' => __('AddBookValidationMessages.attributes.is_author')]),
            'is_author.boolean' => __('AddBookValidationMessages.boolean', ['attribute' => __('AddBookValidationMessages.attributes.is_author')]),
            'is_author.present' => __('AddBookValidationMessages.present', ['attribute' => __('AddBookValidationMessages.attributes.is_author')]),

            'is_free.required' => __('AddBookValidationMessages.required', ['attribute' => __('AddBookValidationMessages.attributes.is_free')]),
            'is_free.boolean' => __('AddBookValidationMessages.boolean', ['attribute' => __('AddBookValidationMessages.attributes.is_free')]),
            'is_free.present' => __('AddBookValidationMessages.present', ['attribute' => __('AddBookValidationMessages.attributes.is_free')]),

            'price.required' => __('AddBookValidationMessages.required', ['attribute' => __('AddBookValidationMessages.attributes.price')]),

            'language.min' => __('AddBookValidationMessages.min.string', ['attribute' => __('AddBookValidationMessages.attributes.language'), 'min' => 2]),
            'language.max' => __('AddBookValidationMessages.max.string', ['attribute' => __('AddBookValidationMessages.attributes.language'), 'max' => 2]),

            'author.required' => __('AddBookValidationMessages.required', ['attribute' => __('AddBookValidationMessages.attributes.author')]),
            'author.max' => __('AddBookValidationMessages.max.string', ['attribute' => __('AddBookValidationMessages.attributes.author'), 'max' => 80]),

            'category.required' => __('AddBookValidationMessages.required', ['attribute' => __('AddBookValidationMessages.attributes.category')]),

            'downloadable.boolean' => __('AddBookValidationMessages.boolean', ['attribute' => __('AddBookValidationMessages.attributes.downloadable')]),

            'cover.image' => __('AddBookValidationMessages.image', ['attribute' => __('AddBookValidationMessages.attributes.cover')]),
            'cover.mimes' => __('AddBookValidationMessages.mimes', ['attribute' => __('AddBookValidationMessages.attributes.cover'), 'values' => 'jpeg, jpg, png, webp']),
            'cover.max' => __('AddBookValidationMessages.max.file', ['attribute' => __('AddBookValidationMessages.attributes.cover'), 'max' => 5120]),

            'book_file.file' => __('AddBookValidationMessages.file', ['attribute' => __('AddBookValidationMessages.attributes.book_file')]),
            'book_file.mimes' => __('AddBookValidationMessages.mimes', ['attribute' => __('AddBookValidationMessages.attributes.book_file'), 'values' => 'pdf']),
            'book_file.max' => __('AddBookValidationMessages.max.file', ['attribute' => __('AddBookValidationMessages.attributes.book_file'), 'max' => 81920]),
        ];
    }

    public function attributes(): array
    {
        return [
            'title' => __('AddBookValidationMessages.title_attribute'),
            'description_attribute' => __('AddBookValidationMessages.description_attribute'),
            'is_author_attribute' => __('AddBookValidationMessages.is_author_attribute'),
            'is_free_attribute' => __('AddBookValidationMessages.is_free_attribute'),
            'price_attribute' => __('AddBookValidationMessages.price_attribute'),
            'language_attribute' => __('AddBookValidationMessages.language_attribute'),
            'author_attribute' => __('AddBookValidationMessages.author_attribute'),
            'category_attribute' => __('AddBookValidationMessages.category_attribute'),
            'downloadable_attribute' => __('AddBookValidationMessages.downloadable_attribute'),
            'cover_attribute' => __('AddBookValidationMessages.cover_attribute'),
            'book_file_attribute' => __('AddBookValidationMessages.book_file_attribute'),
        ];
    }
    protected function failedValidation(Validator $validator)
    {
        // Get the first error from each field
        $errors = $validator->errors()->messages();

        // Filter to get the first error for each field
        $firstErrors = [];

        foreach ($errors as $field => $messages) {
            $firstErrors[$field] = $messages[0];
        }

        // Throw the validation exception with the filtered errors
        throw new HttpResponseException(
            $this->response_error('Validation failed', $firstErrors, 422)
        );
    }

}
