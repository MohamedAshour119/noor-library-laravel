<?php

namespace App\Traits;

trait HttpResponses {
    protected function response_success ($data = [], $message = '', $status_code = 200)
    {
        return response()->json([
            'status' => 'Success response',
            'message' => $message,
            'data' => $data,
        ], $status_code, [], JSON_UNESCAPED_UNICODE);
    }

    protected function response_error($message = '', $errors = [], $status_code)
    {
        return response()->json([
            'status' => 'Error has occurred!',
            'message' => $message,
            'errors' => $errors,
        ], $status_code, [], JSON_UNESCAPED_UNICODE);
    }
}
